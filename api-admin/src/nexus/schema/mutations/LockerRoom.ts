import {mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {User, UserInvites, UserRole} from 'lib-mongoose';
import userRoleTypeExists from '../../../app/checker/userRoleTypeExists';
import userIDExists from '../../../app/checker/userIDExists';
import isUserFirstOwnerOfLockerRoom from '../../../app/checker/isUserFirstOwnerOfLockerRoom';
import incrementGroupAggregates from '../../../app/creator/incrementGroupAggregates';
import lockerRoomIDExists from '../../../app/checker/lockerRoomIDExists';
import getClubOrLeagueOrFanGroup from '../../../app/getter/getClubOrLeagueOrFanGroup';
import isUserPrimaryOwner from '../../../app/checker/isUserPrimaryOwner';
import sendTemplatedEmail from '../../../app/email/sendTemplatedEmail';

/*
addUserManagerialRole Mutation
1. Extract group from Locker Room.
2. Check if role is valid.
3. If both emailAddress and userID is empty, throw an error.
4. Check if user exists.
If user exists:
5.1.1 Check if invited user is primary owner.
5.1.2 Update UserRole - for instances where initially a user was invited as manager then was re-invited as owner vice versa.
5.1.3 Check if invited user is either an owner or manager.
5.1.4 Create/Update User Role.
5.1.5 Delete prior invitation - for instances where owner initially invite user then user didn't used the link to signup, so owner just resends an invitation now the user as an existing user.
5.1.6 Increment Aggregates if new user role was created.
5.1.7 Send email.
else:
5.2.1 If user does not exist, create or update UserInvites entry. Depends if user was already invited.
5.2.2 Insert url.
5.2.3 Send email with link.
 */

export const LockerRoomMutations = mutationField(t => {
  t.nonNull.field('addUserManagerialRole', {
    type: 'MutationResult',
    args: {
      lockerRoomID: nonNull(stringArg()),
      emailAddress: stringArg(),
      userID: stringArg(),
      role: nonNull(stringArg()),
    },
    resolve: async (source, {lockerRoomID, emailAddress, userID, role}) => {
      // 1. Extract group from Locker Room.
      const {group, slug} = await lockerRoomIDExists(lockerRoomID);
      // 2. Check if role is valid.
      await userRoleTypeExists(role);
      // 3. If both emailAddress and userID is empty, throw an error.
      if (!emailAddress && !userID) {
        throw new Error('Input is required.');
      }
      // 4. Check if user exists.
      emailAddress = emailAddress
        ? emailAddress.toLowerCase()
        : (await userIDExists(userID!)).emailAddress.toLowerCase();
      const existingUser = await User.findOne({
        emailAddress,
        isActive: true,
      }).exec();
      const type = 'InviteUserInLockerRoomForManagerialRole';
      const userInviteData = {
        type,
        userID,
        group,
        data: {group, role, lockerRoomID, emailAddress, lockerRoomSlug: slug},
      };
      const [objectType, objectID] = group!.split(':');
      const {name: groupName} = await getClubOrLeagueOrFanGroup(
        objectType,
        objectID,
        {
          name: 1,
        }
      );
      //const subject = `Invitation for a Managerial Role in ${groupName}`;
      const subject = 'Your invite to FX1';
      if (existingUser) {
        const userID = existingUser.id;
        const uid = existingUser.uid;
        // 5.1.1 Check if invited user is primary owner.
        await isUserPrimaryOwner(
          group!,
          userID,
          `Inviting user in group: ${group}`
        );
        // 5.1.2 Update UserRole - for instances where initially a user was invited as manager then was re-invited as owner vice versa.
        // 5.1.3 Check if invited user is either an owner or manager.
        // const invitedUserRole = await getUserRole(group!, userID);
        // if (invitedUserRole?.role === 'owner' && role === 'manager') {
        //   throw new UserInputError('You cannot re-invite an Owner as Manager.');
        // }
        const isPrimaryOwner =
          role === 'owner'
            ? await isUserFirstOwnerOfLockerRoom(lockerRoomID)
            : false;
        // 5.1.4 Create/Update User Role.
        const userRoleExists = await UserRole.findOneAndUpdate(
          {
            group,
            groupType: objectType,
            groupID: objectID,
            userID,
            uid,
            status: 'active',
            lockerRoomID,
          },
          {role, isPrimaryOwner, updatedAt: new Date().getTime()},
          {upsert: true}
        );
        // 5.1.5 Delete prior invitation - for instances where owner initially invite user then user didn't used the link to signup, so owner just resends an invitation now the user as an existing user.
        await UserInvites.findOneAndDelete({
          group,
          type,
          'data.emailAddress': emailAddress,
          'data.lockerRoomID': lockerRoomID,
        }).exec();
        if (!userRoleExists) {
          // 5.1.6 Increment Aggregates if new user role was created.
          await incrementGroupAggregates('supporters', 1, {
            userID,
            lockerRoomID,
            group,
          });
        }
        // 5.1.7 Send email.
        let article = 'a';
        if (role === 'owner') {
          article = 'an';
        }

        await sendTemplatedEmail(
          'inviteUserWithManagerialRoleWithoutLink',
          [emailAddress!],
          {
            subject,
            data: {
              article,
              role,
              groupName,
              redirectingDomain: global.redirectingDomainFX1,
              lockerRoomSlug: slug,
            },
          }
        );
      } else {
        // 5.2.1 If user does not exist, create or update UserInvites entry. Depends if user was already invited.
        const result = (
          await UserInvites.findOneAndUpdate(
            {
              group,
              type,
              'data.emailAddress': emailAddress!.trim(),
              'data.lockerRoomID': lockerRoomID,
            },
            {
              ...userInviteData,
              time: new Date().getTime(),
              expiration: new Date().getTime() + 86400000,
            },
            {upsert: true, new: true}
          )
        ).id;
        const url = `${global.redirectingDomainFX1}/user/invite?accept=${result}`;
        // 5.2.2 Insert url.
        await UserInvites.findByIdAndUpdate(result, {url});
        // 5.2.3 Send email with link.
        let article = 'a';
        if (role === 'owner') {
          article = 'an';
        }

        await sendTemplatedEmail(
          'inviteUserWithManagerialRoleWithLink',
          [emailAddress!],
          {
            subject,
            data: {
              article,
              role,
              groupName,
              redirectingDomain: global.redirectingDomainFX1,
              id: result,
            },
          }
        );
      }
      return new MutationResult('Locker Room', lockerRoomID);
    },
  });
});
