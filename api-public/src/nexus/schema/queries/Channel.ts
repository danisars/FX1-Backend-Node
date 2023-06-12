import {nonNull, queryField, stringArg} from 'nexus';
import {Channel, ChannelDocument, UserInvites} from 'lib-mongoose';
import {channelFilter} from '../../../utilities';
import stringToObjectId from '../../../app/transform/stringToObjectId';
import requireLoggedIn from '../../../app/assertion/requireLoggedIn';
import requireHasUserAccount from '../../../app/assertion/requireHasUserAccount';
import gameIDExists from '../../../app/checker/gameIDExists';
import {createDynamicUrl} from '../../../dynamicLink';
import PrivateChannelIDExists from '../../../app/checker/PrivateChannelIDExists';

const MAX_OF_DATE = 8640000000000000;

interface ICreateLink {
  uid?: string | null;
  userID?: string | null;
  privateChannelID: string;
  gameID: string;
}

export const createActualInviteLink = async (param: ICreateLink, channel: ChannelDocument): Promise<string> => {
  const {userID, privateChannelID, gameID} = param;
  // 1. Create user invitation
  const invite = await UserInvites.create({
    group: `Channel:${privateChannelID}`,
    type: 'InviteToPrivateChannel',
    expiration: MAX_OF_DATE, // non expirable
    data: {gameID, privateChannelID, privateChannelName: channel.name, group: `Game:${gameID}`},
    userID,
  });
  // 2. Generate a invite url
  invite.url = `${process.env.BASE_URL}/user/invite?accept=${invite.id}`;
  await invite.save();
  return invite.url;
};

const generateLink = async (type: string, param: ICreateLink): Promise<string> => {
  const {uid, privateChannelID, gameID} = param;
  // 1. Require a user logged in.
  requireLoggedIn(uid);
  // 2. Require a user account.
  await requireHasUserAccount(uid);
  // 3. Verify if inputted private channel exists.
  const channel = await PrivateChannelIDExists(privateChannelID);
  // 4. Verify if inputted game exists.
  await gameIDExists(gameID);

  const actualInviteLink = await createActualInviteLink(param, channel);
  if (type === 'actualLink') {
    return actualInviteLink;
  } else {
    return await createDynamicUrl(actualInviteLink);
  }
};

export const ChannelQuery = queryField(t => {
  t.field('getChannel', {
    type: 'Channel',
    args: {
      id: stringArg(),
      slug: stringArg(),
    },
    resolve: async (source, {id, slug}) => {
      if (id) {
        const channelID = stringToObjectId(id);
        return await Channel.findOne({...channelFilter, _id: channelID}).exec();
      }
      return await Channel.findOne({...channelFilter, slug}).exec();
    },
  });
  t.nonNull.field('getChannels', {
    type: 'Channels',
    args: {
      channelGroupID: stringArg(),
    },
    resolve: async (source, {channelGroupID}) => {
      let items;
      items = await Channel.find(channelFilter).exec();
      if (channelGroupID) {
        items = await Channel.find({...channelFilter, channelGroupID}).exec();
      }
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });

  t.boolean('channelExists', {
    args: {
      name: nonNull(stringArg()),
      channelGroupID: nonNull(stringArg()),
    },
    resolve: async (source, {name, channelGroupID}) => {
      const items = await Channel.findOne({...channelFilter, name, channelGroupID}).exec();
      return !!items;
    },
  });
  t.nonNull.string('getActualEventInviteLink', {
    args: {
      privateChannelID: nonNull(stringArg()),
      gameID: nonNull(stringArg()),
    },
    resolve: async (source, {privateChannelID, gameID}, {uid, userID}) => {
      return await generateLink('actualLink', {uid, userID, privateChannelID, gameID});
    },
  });
  t.nonNull.string('getDynamicEventInviteLink', {
    args: {
      privateChannelID: nonNull(stringArg()),
      gameID: nonNull(stringArg()),
    },
    resolve: async (source, {privateChannelID, gameID}, {uid, userID}) => {
      return await generateLink('dynamicLink', {uid, userID, privateChannelID, gameID});
    },
  });
});
