import {intArg, nonNull, queryField, stringArg} from 'nexus';
import {
  Club,
  ClubDocument,
  FanGroup,
  FanGroupDocument,
  League,
  LeagueDocument,
  LockerRoom,
  User,
  UserRole,
  UserInvites,
} from 'lib-mongoose';
import userInviteIDExists from '../../../app/checker/userInviteIDExists';
import getSupportedLockerRooms from '../../../app/getter/getSupportedLockerRooms';
import {fanGroupFilter, userFilter} from '../../../utilities';
import requireLoggedIn from '../../../app/assertion/requireLoggedIn';
import requireHasUserAccount from '../../../app/assertion/requireHasUserAccount';
import lockerRoomIDExists from '../../../app/checker/lockerRoomIDExists';

export const LockerRoomQuery = queryField(t => {
  t.field('getLockerRoom', {
    type: 'LockerRoom',
    args: {
      id: stringArg(),
      slug: stringArg(),
      group: stringArg(),
    },
    resolve: async (source, {id, slug, group}) => {
      if (id) {
        return await LockerRoom.findById(id).exec();
      }
      if (slug) {
        return await LockerRoom.findOne({slug}).exec();
      }
      if (group) {
        return await LockerRoom.findOne({group}).exec();
      }
      return null;
    },
  });
  t.nonNull.field('getLockerRooms', {
    type: 'LockerRooms',
    resolve: async () => {
      const items = await LockerRoom.find({group: {$not: /Game/}}).exec();
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });
  t.boolean('invitedUserExists', {
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}) => {
      // Note: This will be used prior to running respondUserManagerialRoleInvite API
      await userInviteIDExists(id);
      const emailAddress = (await UserInvites.findById(id, {'data.emailAddress': 1}).exec())!.data.emailAddress;
      const exists = await User.findOne({emailAddress, ...userFilter}).exec();
      return !!exists;
    },
  });
  t.list.field('Supporting', {
    type: 'LockerRoom',
    resolve: async (source, args, {uid}) => {
      return uid ? await getSupportedLockerRooms(uid) : [];
    },
  });
  t.nonNull.list.nonNull.field('getFeatured', {
    type: 'LockerRoom',
    resolve: async () => {
      const clubs = (await Club.find({isFeatured: true}).exec()).map((item: ClubDocument) => `Club:${item.id}`);
      const leagues = (await League.find({isFeatured: true}).exec()).map((item: LeagueDocument) => `League:${item.id}`);
      const fanGroups = (await FanGroup.find({...fanGroupFilter, isFeatured: true}).exec()).map(
        (item: FanGroupDocument) => `FanGroup:${item.id}`
      );
      const groups = clubs.concat(leagues).concat(fanGroups);
      return await LockerRoom.find({group: {$in: groups}})
        .sort({name: 1})
        .exec();
    },
  });
  t.nonNull.field('getAvailableUsersForPrivateChannel', {
    type: 'Users',
    args: {
      lockerRoomID: nonNull(stringArg()),
      next: stringArg(),
      count: intArg(),
      name: stringArg(),
    },
    resolve: async (source, {lockerRoomID, next, count, name}, {uid, userID}) => {
      const defaultCount = 10;
      // 1. Require a user logged in.
      requireLoggedIn(uid);
      // 2. Require a user account.
      const customClaims = await requireHasUserAccount(uid);
      // 3. Verify if lockerRoomID exists
      await lockerRoomIDExists(lockerRoomID);
      // 4. Get Private Group users and add me to exception list.
      const currentMemberIDs = (await UserRole.find({groupType: 'Channel', lockerRoomID}).exec())
        .map(ele => ele.userID)
        .concat(userID || customClaims.app.userID);
      // 5. Get available users excluding existing private users and me.
      const filter: any = {$and: [{_id: {$nin: currentMemberIDs}}]};
      if (name) filter.$and.push({username: {$regex: new RegExp(name, 'i')}});
      if (next) filter.$and.push({_id: {$gt: next}});
      const availableUsers = await User.find(filter)
        .limit(count || defaultCount)
        .exec();
      return {
        count: availableUsers.length,
        items: availableUsers,
        next: availableUsers.length > 0 ? availableUsers[availableUsers.length - 1].id : null,
      };
    },
  });
});
