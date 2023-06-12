import {arg, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {Channel, User, UserRole} from 'lib-mongoose';
import requireLoggedIn from '../../../app/assertion/requireLoggedIn';
import requireHasUserAccount from '../../../app/assertion/requireHasUserAccount';
import channelGroupIDExists from '../../../app/checker/channelGroupIDExists';
import channelTypeExists from '../../../app/checker/channelTypeExists';
import isUserOwnerOrManager from '../../../app/checker/isUserOwnerOrManager';
import channelCountLimitReached from '../../../app/checker/channelCountLimitReached';
import {IAppResolverContext} from '../../../interfaces';
import createChannel from '../../../app/creator/createChannel';
import incrementGroupAggregates from '../../../app/creator/incrementGroupAggregates';
import {channelFilter} from '../../../utilities';
import {UserInputError} from 'apollo-server-express';
import stringToObjectId from '../../../app/transform/stringToObjectId';
import channelIDExists from '../../../app/checker/channelIDExists';
import getChannelSlugs from '../../../app/getter/getChannelSlugs';
import isPrivateChatForGame from '../../../app/checker/isPrivateChatForGame';
import isPrivateChannelOwner from '../../../app/checker/isPrivateChannelOwner';
import privateChannelIDExists from '../../../app/checker/PrivateChannelIDExists';
import gameIDExists from '../../../app/checker/gameIDExists';
import userInviteIDExists from '../../../app/checker/userInviteIDExists';
import {sendInvitePushNotification} from '../../../app/fcmNotification/pushNotification';
import userIDExists from '../../../app/checker/userIDExists';
import isUserMemberOfPrivateGroup from '../../../app/checker/isUserMemberOfPrivateGroup';
import createGameUserRole from '../../../app/creator/createGameUserRole';
import generateRedirectURL from '../../../app/creator/generateRedirectURL';
import privateRoomInvite from '../../../app/email/helpers/privateRoomInvite';

/*
Channel Mutations
Pre-requisite:
1. Require a logged in user.
2. Require a user account.

Creation:
1. Verify if inputted channelGroupID exists else throw an error.
2. Verify if inputted type exists else throw an error.
3. Verify if the private channel to be created is for a game.
If it is not a game:
4.1.1. Verify if user is owner/manager else throw an error.
4.1.2. Verify if Channel max limit reached.
If it is a game:
4.2.1. Verify if the user has already owned/joined a private group for this game as currently user can only own/join one private group per game.
5. Create the Channel doc and increment all related groupAggregates.
If it is a game:
6.1. Check if added user exists.
6.2. Create joiner role.
6.3. Send push notification to joiners.

Edit:
1. Verify if user is owner/manager else throw an error.
2. Verify if inputted type exists else throw an error.
3. Update the Channel.
4. If not successful, return null.

Delete:
1. Verify if user is owner/manager else throw an error.
2. Check if this is the only channel left in locker room. If true, throw an error else proceed.
3. Delete("Update") the Channel.
4. Decrement all related aggregates for the Channel.
5. Update global.lockerRoomIDToDefaultSlug list.
6. If not successful, return null.

Un-Delete:
1. Verify if user is owner/manager else throw an error.
2. Check number of channels the lockerRoom has.
3. Undo Delete("Update") the Channel.
4. Increment all related aggregates for the Channel.
5. If not successful, return null.
 */

export interface IInputCreateChannel {
  name: string;
  description?: string | null | undefined;
  channelGroupID: string;
  type: string;
  userIDs?: string[] | null;
}
interface IInputEditChannel {
  name: string;
  description?: string | null | undefined;
  type: string;
}

async function implementation(
  type: string,
  inputCreate: IInputCreateChannel | null,
  inputEdit: IInputEditChannel | null,
  id: string | null,
  context: IAppResolverContext
) {
  const {uid} = context;
  // 1. Require a logged in user.
  requireLoggedIn(uid);
  // 2. Require a user account.
  const customClaims = await requireHasUserAccount(uid);
  const userID = customClaims.app.userID;
  // 2.2 Check if user ID exists
  const ownerUser = await userIDExists(userID);

  if (type === 'create') {
    const input = inputCreate!;
    const {channelGroupID, type} = input;
    // 1. Verify if inputted channelGroupID exists else throw an error.
    const channelGroup = await channelGroupIDExists(channelGroupID);
    const {group, lockerRoomID} = channelGroup!;
    const [groupType, groupID] = group.split(':');

    // 2. Verify if inputted type exists else throw an error.
    channelTypeExists(type);
    // 3. Verify if the private channel to be created is for a game.
    isPrivateChatForGame(type, groupType);

    if (groupType !== 'Game') {
      // If it is not a game:
      // 4.1.1. Verify if user is owner/manager else throw an error.
      await isUserOwnerOrManager(group, userID, `Creating Channel on ChannelGroup:${channelGroupID}`);
      // 4.1.2. Verify if Channel max limit reached.
      await channelCountLimitReached(lockerRoomID);
    } else {
      // If it is a game:
      // 4.2.1. Verify if the user has already owned/joined a private group for this game as currently user can only own/join one private group per game.
      await isUserMemberOfPrivateGroup(lockerRoomID, userID);
    }

    // 5. Create the Channel doc and increment all related groupAggregates.
    const result = await createChannel(input, lockerRoomID);

    if (groupType === 'Game') {
      await createGameUserRole(result, userID, uid!, 'owner', lockerRoomID);

      const game = await gameIDExists(groupID);

      if (input.userIDs && input.userIDs.length > 0) {
        for (const userID of input.userIDs) {
          try {
            // 6.1. Check if added user exists.
            const user = await userIDExists(userID);
            // 6.2. Create joiner role.
            await createGameUserRole(result, userID, user.uid, 'joiner', lockerRoomID);
            // 6.3. Send a notification email and push notification to user
            setTimeout(() => {
              privateRoomInvite(user, ownerUser, game);
              sendInvitePushNotification(userID, {
                gameID: groupID,
                actorID: userID,
                username: user.username,
                'private-room-owner': ownerUser.username,
                team1: game.team1DisplayName,
                team2: game.team2DisplayName,
                'invite-link': generateRedirectURL(game),
                group,
              });
            }, 100);
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
    return result.id;
  }
  if (type === 'undelete') {
    const channelGroupID = (await channelIDExists(id!, true)).channelGroupID;
    const channelGroup = await channelGroupIDExists(channelGroupID);
    const {group, lockerRoomID} = channelGroup;
    // 1. Verify if user is owner/manager else throw an error.
    await isUserOwnerOrManager(group, userID, `Undo Deleting Channel:${id}`);
    // 2. Check number of channels the lockerRoom has.
    await channelCountLimitReached(lockerRoomID);
    // 3. Undo Delete("Update") the Channel.
    const result = await Channel.findOneAndUpdate(
      {isDeleted: true, _id: stringToObjectId(id!)},
      {isDeleted: false, updatedAt: new Date().getTime()}
    ).exec();
    // 4. Increment all related aggregates for the Channel.
    if (result) {
      await incrementGroupAggregates('channels', 1, {group, id, lockerRoomID});
    }
    // 5. If not successful, return null.
    return result?.id;
  }

  const channel = await channelIDExists(id!);
  const channelGroupID = channel.channelGroupID;
  const channelGroup = await channelGroupIDExists(channelGroupID);
  const {group, lockerRoomID} = channelGroup;
  if (type === 'edit') {
    // 1. Verify if user is owner/manager else throw an error.
    await isUserOwnerOrManager(group, userID, `Editing Channel:${id}`);
    // 2. Verify if inputted type exists else throw an error.
    channelTypeExists(inputEdit!.type);
    // 3. Update the Channel.
    const result = await Channel.findOneAndUpdate(
      {...channelFilter, _id: stringToObjectId(id!)},
      {
        ...inputEdit,
        updatedAt: new Date().getTime(),
      }
    ).exec();
    // 4. If not successful, return null.
    return result?.id;
  }
  if (type === 'delete') {
    let transformedGroup = group;
    if (group.startsWith('Game') && channel.type === 'Private') {
      // TODO check userRole - whether to delete the entries there as well
      transformedGroup = `Channel:${id}`;
    }
    // 1. Verify if user is owner/manager else throw an error.
    await isUserOwnerOrManager(transformedGroup, userID, `Delete Channel:${id}`);
    // 2. Check if this is the only channel left in locker room. If true, throw an error else proceed.
    const channelSlugs = await getChannelSlugs(lockerRoomID);
    if (channelSlugs.length === 1) {
      // throw new UserInputError('Can no longer delete this channel. Create another one first.');
      throw new UserInputError(
        'Every Locker Room must have at least 1 channel, create another first and please try again'
      );
    }
    // 3. Delete("Update") the Channel.
    const result = await Channel.findOneAndUpdate(
      {...channelFilter, _id: stringToObjectId(id!)},
      {isDeleted: true, updatedAt: new Date().getTime()}
    ).exec();

    if (result) {
      // 4. Decrement all related aggregates for the Channel.
      await incrementGroupAggregates('channels', -1, {group, id, lockerRoomID});
      // 5. Update global.lockerRoomIDToDefaultSlug list.
      // global.lockerRoomIDToDefaultSlug[lockerRoomID] = await getDefaultChannelSlug(lockerRoomID);
    }
    // 6. If not successful, return null.
    return result?.id;
  }

  return null;
}

export const ChannelMutations = mutationField(t => {
  t.nonNull.field('createChannel', {
    type: 'MutationResult',
    args: {
      input: arg({type: nonNull('InputCreateChannel')}),
    },
    resolve: async (source, {input}, context) => {
      const result = await implementation('create', input, null, null, context);
      return new MutationResult('Channel', result);
    },
  });
  t.nonNull.field('editChannel', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
      input: arg({type: nonNull('InputEditChannel')}),
    },
    resolve: async (source, {id, input}, context) => {
      // const result = await implementation('edit', null, input, null, id, context);
      const result = await implementation('edit', null, input, id, context);
      return new MutationResult('Channel', result);
    },
  });
  t.nonNull.field('deleteChannel', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}, context) => {
      const result = await implementation('delete', null, null, id, context);
      return new MutationResult('Channel', result);
    },
  });
  t.nonNull.field('undeleteChannel', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}, context) => {
      const result = await implementation('undelete', null, null, id, context);
      return new MutationResult('Channel', result);
    },
  });
  t.nonNull.field('leavePrivateChannel', {
    type: 'MutationResult',
    args: {
      privateChannelID: nonNull(stringArg()),
    },
    resolve: async (source, {privateChannelID}, context) => {
      const {uid} = context;
      // 1. Require a logged in user.
      requireLoggedIn(uid);
      // 2. Require a user account.
      await requireHasUserAccount(uid);
      // 3. Verify if inputted privateChannel exists.
      await privateChannelIDExists(privateChannelID);
      // 4. Verify if inputted user is owner of the private channel
      const owner = await isPrivateChannelOwner(privateChannelID, uid!, false);
      if (owner) throw new UserInputError('You cannot leave this channel because you are the owner');
      // 5. Run findOneAndDelete to remove from UserRole.
      const group = `Channel:${privateChannelID}`;
      await UserRole.findOneAndDelete({group, uid, role: 'joiner'}).exec();

      return new MutationResult('leavePrivateChannel', group!.split(':')[1]);
    },
  });
  t.nonNull.field('acceptInvitationToPrivateChannel', {
    type: 'MutationResult',
    args: {
      token: nonNull(stringArg()),
    },
    resolve: async (source, {token}, {uid, userID}) => {
      // 1. Require a user logged in.
      requireLoggedIn(uid);
      // 2. Require a user account.
      const customClaims = await requireHasUserAccount(uid);
      // 3. Verify if the inputted invitation token exists and is valid.
      const invite = await userInviteIDExists(token);
      // if (invite.expiration < new Date().getTime()) {
      //   throw new UserInputError('The invitation has been expired. Please use another link.');
      // }

      // Delete the invitation
      // await UserInvites.findByIdAndDelete(token);

      // 4. Add the user to the private channel if no more errors
      const {gameID, privateChannelID} = invite.data;
      if (!gameID || !privateChannelID) {
        throw new UserInputError('The invitation is not valid.');
      }
      const channel = await privateChannelIDExists(privateChannelID);
      // const owner = await UserRole.findOne({
      //   userID,
      //   role: 'owner',
      //   groupType: 'Channel',
      //   lockerRoomID: channel.lockerRoomID,
      // }).exec();
      // const meJoiner = await UserRole.findOne({groupID: channel.id, userID, role: 'joiner'}).exec();
      // if (owner) throw new UserInputError('You are member of one group, you cannot accept two at a time.');
      // if (meJoiner) throw new UserInputError('You have already joined in this group.');

      // get userID directly from database
      const currentUser = await User.findOne({uid}).exec();

      await isUserMemberOfPrivateGroup(channel.lockerRoomID, userID ? userID : customClaims.app.userID);
      await createGameUserRole(
        channel,
        currentUser?.id || userID || customClaims.app.userID,
        uid!,
        'joiner',
        channel.lockerRoomID
      );

      //5. Generate a redirect url.
      const game = await gameIDExists(gameID);
      const redirectUrl = generateRedirectURL(game);

      return new MutationResult('RedirectUrl', redirectUrl);
    },
  });
});
