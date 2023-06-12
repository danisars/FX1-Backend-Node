import {GraphQLClient} from 'graphql-request';
import {getSdk} from '../types/graphql';
import {
  GroupAggregates,
  Sport,
  Club,
  League,
  Channel,
  ChannelGroup,
  LockerRoom,
} from 'lib-mongoose';

const url = 'http://localhost:8080/graphql';
let api: ReturnType<typeof getSdk>;
let sportGroup: string;
let league: string;

beforeAll(async () => {
  const client = new GraphQLClient(url);
  api = getSdk(client);
  sportGroup = (await Sport.find().exec())[0].id;
  league = (await League.findOne({
    sportIDs: `${sportGroup}`,
  }).exec())!.id!;
});

/*
1. Club
2. Locker Room
3. Channel Group
4. Channel
5. GroupAggregates.increment(group, {clubs: 1}) for sport
6. GroupAggregates.increment(group, {clubs: 1}) for league
7. GroupAggregates.create({group: `Club:${result.id}`}) for new Club
8. GroupAggregates.create({group: `Club:${result.id}`}) for new Locker Room
 */
export default () => {
  describe('Test Creation of Club with League', () => {
    let initialClubObjectIDs: string[];
    let initialSportCount = 0;
    let initialLeagueCount = 0;
    let initialClubCount = 0;
    let initialLockerRoomCount = 0;
    let initialChannelGroupCount = 0;
    let initialChannelCount = 0;
    let initialGroupAggregatesCount = 0;
    let initialGrpAggSportClubsCount = 0;
    let initialGrpAggSportChannelGroupsCount = 0;
    let initialGrpAggSportChannelsCount = 0;
    let initialGrpAggLeagueClubsCount = 0;
    let initialGrpAggLeagueChannelGroupsCount = 0;
    let initialGrpAggLeagueChannelsCount = 0;
    let newClubObjectID: string;
    let newLockerRoomObjectID: string;
    let newChannelGroupObjectID: string;
    it('1. Initialize', async () => {
      initialClubObjectIDs = (await Club.find().exec()).map(
        (item: any) => item.id
      );
      initialSportCount = await Sport.countDocuments();
      initialLeagueCount = await League.countDocuments();
      initialClubCount = await Club.countDocuments();
      initialLockerRoomCount = await LockerRoom.countDocuments();
      initialChannelGroupCount = await ChannelGroup.countDocuments();
      initialChannelCount = await Channel.countDocuments();
      initialGroupAggregatesCount = await GroupAggregates.countDocuments();
      initialGrpAggSportClubsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.clubs!;
      initialGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      initialGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
      initialGrpAggLeagueClubsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.clubs!;
      initialGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channelGroups!;
      initialGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channels!;
    }, 30000);
    it('2. Create Club', async () => {
      const {result} = await api.createClub({
        input: {
          Avatar: null,
          leagueID: league,
          name: 'test club',
          sportIDs: [sportGroup],
        },
      });
      newClubObjectID = result.objectID!;
      expect(result.objectType).toEqual('Club');
      expect(result.success).toBeTruthy();
      expect(initialClubObjectIDs.includes(result.objectID!)).toBeFalsy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. Club entry should be created', async () => {
      const getNewClub = await Club.findById(newClubObjectID).exec();
      expect(getNewClub).not.toBeNull();
    }, 30000);
    it("4. Club collection's documents should increment by at least 1", async () => {
      const finalClubCount = await Club.countDocuments();
      expect(finalClubCount).toBeGreaterThan(initialClubCount);
    }, 30000);
    it('5. Default Locker Room should be created', async () => {
      const defaultLockerRoom = await LockerRoom.findOne({
        group: `Club:${newClubObjectID}`,
      }).exec();
      expect(defaultLockerRoom).not.toBeNull();
      newLockerRoomObjectID = defaultLockerRoom?.id.toString();
    }, 30000);
    it('6. Default ChannelGroup should be created', async () => {
      const defaultChannelInformation = await ChannelGroup.findOne({
        group: `Club:${newClubObjectID}`,
      }).exec();
      expect(defaultChannelInformation).not.toBeNull();
      newChannelGroupObjectID = defaultChannelInformation?.id.toString();
    }, 30000);
    it('7. Default Channels should be created', async () => {
      const defaultChannelGeneral = await Channel.findOne({
        name: 'General',
        channelGroupID: newChannelGroupObjectID,
      }).exec();
      const defaultChannelAnnouncements = await Channel.findOne({
        name: 'Announcements',
        channelGroupID: newChannelGroupObjectID,
      }).exec();
      const defaultChannelInjuries = await Channel.findOne({
        name: 'Injuries',
        channelGroupID: newChannelGroupObjectID,
      }).exec();
      expect(defaultChannelGeneral).not.toBeNull();
      expect(defaultChannelAnnouncements).not.toBeNull();
      expect(defaultChannelInjuries).not.toBeNull();
    }, 30000);
    it("8. GroupAggregates of chosen sport's club should increment by 1", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec();
      expect(findGroupAggregates?.clubs).toEqual(
        initialGrpAggSportClubsCount + 1
      );
    }, 30000);
    it("9. GroupAggregates of chosen sport's channel group should increment by 1", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec();
      expect(initialGrpAggSportChannelGroupsCount + 1).toEqual(
        findGroupAggregates?.channelGroups
      );
    }, 30000);
    it("10. GroupAggregates of chosen sport's channel should increment by 3", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec();
      expect(initialGrpAggSportChannelsCount + 3).toEqual(
        findGroupAggregates?.channels
      );
    }, 30000);
    it("11. GroupAggregates of chosen league's club should increment by 1", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec();
      expect(findGroupAggregates?.clubs).toEqual(
        initialGrpAggLeagueClubsCount + 1
      );
    }, 30000);
    it("12. GroupAggregates of chosen league's channel group should increment by 1", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec();
      expect(initialGrpAggLeagueChannelGroupsCount + 1).toEqual(
        findGroupAggregates?.channelGroups
      );
    }, 30000);
    it("13. GroupAggregates of chosen league's channel should increment by 3", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec();
      expect(initialGrpAggLeagueChannelsCount + 3).toEqual(
        findGroupAggregates?.channels
      );
    }, 30000);
    it('14. GroupAggregates of Club should be created', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Club:${newClubObjectID}`,
      }).exec();
      expect(findGroupAggregates).not.toBeNull();
      expect(findGroupAggregates?.channelGroups).toEqual(1);
      expect(findGroupAggregates?.channels).toEqual(3);
    }, 30000);
    it('15. GroupAggregates of Club Locker Room should be created', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `LockerRoom:${newLockerRoomObjectID}`,
      }).exec();
      expect(findGroupAggregates).not.toBeNull();
      expect(findGroupAggregates?.channelGroups).toEqual(1);
      expect(findGroupAggregates?.channels).toEqual(3);
    }, 30000);

    it('16. Teardown', async () => {
      await Club.findByIdAndDelete(newClubObjectID).exec();
      await GroupAggregates.deleteMany({
        $or: [
          {group: `LockerRoom:${newLockerRoomObjectID}`},
          {group: `Club:${newClubObjectID}`},
        ],
      }).exec();
      await GroupAggregates.increment(`Sport:${sportGroup}`, {
        clubs: -1,
        channelGroups: -1,
        channels: -3,
      });
      await GroupAggregates.increment(`League:${league}`, {
        clubs: -1,
        channelGroups: -1,
        channels: -3,
      });
      await LockerRoom.findByIdAndDelete(newLockerRoomObjectID).exec();
      await ChannelGroup.findByIdAndDelete(newChannelGroupObjectID).exec();
      await Channel.deleteMany({
        channelGroupID: newChannelGroupObjectID,
      }).exec();
      expect(await Sport.countDocuments()).toEqual(initialSportCount);
      expect(await League.countDocuments()).toEqual(initialLeagueCount);
      expect(await Club.countDocuments()).toEqual(initialClubCount);
      expect(await LockerRoom.countDocuments()).toEqual(initialLockerRoomCount);
      expect(await ChannelGroup.countDocuments()).toEqual(
        initialChannelGroupCount
      );
      expect(await Channel.countDocuments()).toEqual(initialChannelCount);
      expect(await GroupAggregates.countDocuments()).toEqual(
        initialGroupAggregatesCount
      );
      expect(initialGrpAggSportClubsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.clubs!
      );
      expect(initialGrpAggSportChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggSportChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggLeagueClubsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.clubs!
      );
      expect(initialGrpAggLeagueChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggLeagueChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channels!
      );
      expect(
        await LockerRoom.findById(newLockerRoomObjectID).exec()
      ).toBeNull();
      expect(
        await ChannelGroup.findById(newChannelGroupObjectID).exec()
      ).toBeNull();
      expect(
        (await Channel.find({channelGroupID: newChannelGroupObjectID}).exec())
          .length
      ).toEqual(0);
    }, 30000);
  });
  // describe('Test Creation of Club without League', () => {
  //   let initialClubObjectIDs: string[];
  //   let initialSportCount = 0;
  //   let initialLeagueCount = 0;
  //   let initialClubCount = 0;
  //   let initialLockerRoomCount = 0;
  //   let initialChannelGroupCount = 0;
  //   let initialChannelCount = 0;
  //   let initialGroupAggregatesCount = 0;
  //   let initialGrpAggSportClubsCount = 0;
  //   let initialGrpAggLeagueClubsCount = 0;
  //   let initialGrpAggSportChannelGroupsCount = 0;
  //   let initialGrpAggSportChannelsCount = 0;
  //   let initialGrpAggLeagueChannelGroupsCount = 0;
  //   let initialGrpAggLeagueChannelsCount = 0;
  //   let newClubObjectID: string;
  //   let newLockerRoomObjectID: string;
  //   let newChannelGroupObjectID: string;
  //   it('1. Initialize', async () => {
  //     initialClubObjectIDs = (await Club.find().exec()).map(
  //       (item: any) => item.id
  //     );
  //     initialSportCount = await Sport.countDocuments();
  //     initialLeagueCount = await League.countDocuments();
  //     initialClubCount = await Club.countDocuments();
  //     initialLockerRoomCount = await LockerRoom.countDocuments();
  //     initialChannelGroupCount = await ChannelGroup.countDocuments();
  //     initialChannelCount = await Channel.countDocuments();
  //     initialGroupAggregatesCount = await GroupAggregates.countDocuments();
  //     initialGrpAggSportClubsCount = (await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec())!.clubs!;
  //     initialGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec())!.channelGroups!;
  //     initialGrpAggSportChannelsCount = (await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec())!.channels!;
  //     initialGrpAggLeagueClubsCount = (await GroupAggregates.findOne({
  //       group: `League:${league}`,
  //     }).exec())!.clubs!;
  //     initialGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
  //       group: `League:${league}`,
  //     }).exec())!.channelGroups!;
  //     initialGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
  //       group: `League:${league}`,
  //     }).exec())!.channels!;
  //   }, 30000);
  //   it('2. Create Club', async () => {
  //     const {result} = await api.createClub({
  //       input: {
  //         Avatar: null,
  //         leagueID: null,
  //         name: 'test club without league',
  //         sportIDs: [sportGroup],
  //       },
  //     });
  //     newClubObjectID = result.objectID!;
  //     expect(result.objectType).toEqual('Club');
  //     expect(result.success).toBeTruthy();
  //     expect(initialClubObjectIDs.includes(result.objectID!)).toBeFalsy();
  //     expect(result.timestamp).not.toBeNull();
  //   }, 30000);
  //   it('3. Club entry should be created', async () => {
  //     const getNewClub = await Club.findById(newClubObjectID).exec();
  //     expect(getNewClub).not.toBeNull();
  //   }, 30000);
  //   it("4. Club collection's documents should increment by at least 1", async () => {
  //     const finalClubCount = await Club.countDocuments();
  //     expect(finalClubCount).toBeGreaterThan(initialClubCount);
  //   }, 30000);
  //   it('5. Default Locker Room should be created', async () => {
  //     const defaultLockerRoom = await LockerRoom.findOne({
  //       group: `Club:${newClubObjectID}`,
  //     }).exec();
  //     expect(defaultLockerRoom).not.toBeNull();
  //     newLockerRoomObjectID = defaultLockerRoom?.id.toString();
  //   }, 30000);
  //   it('6. Default ChannelGroup should be created', async () => {
  //     const defaultChannelInformation = await ChannelGroup.findOne({
  //       group: `Club:${newClubObjectID}`,
  //     }).exec();
  //     expect(defaultChannelInformation).not.toBeNull();
  //     newChannelGroupObjectID = defaultChannelInformation?.id.toString();
  //   }, 30000);
  //   it('7. Default Channels should be created', async () => {
  //     const defaultChannelGeneral = await Channel.findOne({
  //       name: 'General',
  //       channelGroupID: newChannelGroupObjectID,
  //     }).exec();
  //     const defaultChannelAnnouncements = await Channel.findOne({
  //       name: 'Announcements',
  //       channelGroupID: newChannelGroupObjectID,
  //     }).exec();
  //     const defaultChannelInjuries = await Channel.findOne({
  //       name: 'Injuries',
  //       channelGroupID: newChannelGroupObjectID,
  //     }).exec();
  //     expect(defaultChannelGeneral).not.toBeNull();
  //     expect(defaultChannelAnnouncements).not.toBeNull();
  //     expect(defaultChannelInjuries).not.toBeNull();
  //   }, 30000);
  //   it("8. GroupAggregates of chosen sport's club should increment by 1", async () => {
  //     const findGroupAggregates = await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec();
  //     expect(findGroupAggregates?.clubs).toEqual(1);
  //   }, 30000);
  //   it("9. GroupAggregates of chosen sport's channel group should increment by 1", async () => {
  //     const findGroupAggregates = await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec();
  //     expect(initialGrpAggSportChannelGroupsCount + 1).toEqual(
  //       findGroupAggregates?.channelGroups
  //     );
  //   }, 30000);
  //   it("10. GroupAggregates of chosen sport's channel should increment by 3", async () => {
  //     const findGroupAggregates = await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec();
  //     expect(initialGrpAggSportChannelsCount + 3).toEqual(
  //       findGroupAggregates?.channels
  //     );
  //   }, 30000);
  //   it("11. GroupAggregates of created league's club should not be incremented", async () => {
  //     const findGroupAggregates = await GroupAggregates.findOne({
  //       group: `League:${league}`,
  //     }).exec();
  //     expect(findGroupAggregates?.clubs).toEqual(initialGrpAggLeagueClubsCount);
  //   }, 30000);
  //   it("12. GroupAggregates of created league's channel group should not be incremented", async () => {
  //     const findGroupAggregates = await GroupAggregates.findOne({
  //       group: `League:${league}`,
  //     }).exec();
  //     expect(findGroupAggregates?.channelGroups).toEqual(
  //       initialGrpAggLeagueChannelGroupsCount
  //     );
  //   }, 30000);
  //   it("13. GroupAggregates of created league's channel should not be incremented", async () => {
  //     const findGroupAggregates = await GroupAggregates.findOne({
  //       group: `League:${league}`,
  //     }).exec();
  //     expect(findGroupAggregates?.channels).toEqual(
  //       initialGrpAggLeagueChannelsCount
  //     );
  //   }, 30000);
  //   it('14. GroupAggregates of Club should be created', async () => {
  //     const findGroupAggregates = await GroupAggregates.findOne({
  //       group: `Club:${newClubObjectID}`,
  //     }).exec();
  //     expect(findGroupAggregates).not.toBeNull();
  //     expect(findGroupAggregates?.channelGroups).toEqual(1);
  //     expect(findGroupAggregates?.channels).toEqual(3);
  //   }, 30000);
  //   it('15. GroupAggregates of Club Locker Room should be created', async () => {
  //     const findGroupAggregates = await GroupAggregates.findOne({
  //       group: `LockerRoom:${newLockerRoomObjectID}`,
  //     }).exec();
  //     expect(findGroupAggregates).not.toBeNull();
  //     expect(findGroupAggregates?.channelGroups).toEqual(1);
  //     expect(findGroupAggregates?.channels).toEqual(3);
  //   }, 30000);
  //   it('16. Teardown', async () => {
  //     await Club.findByIdAndDelete(newClubObjectID).exec();
  //     await GroupAggregates.deleteMany({
  //       $or: [
  //         {group: `LockerRoom:${newLockerRoomObjectID}`},
  //         {group: `Club:${newClubObjectID}`},
  //       ],
  //     }).exec();
  //     await GroupAggregates.increment(`Sport:${sportGroup}`, {
  //       clubs: -1,
  //       channelGroups: -1,
  //       channels: -3,
  //     });
  //     await LockerRoom.findByIdAndDelete(newLockerRoomObjectID).exec();
  //     await ChannelGroup.findByIdAndDelete(newChannelGroupObjectID).exec();
  //     await Channel.deleteMany({
  //       channelGroupID: newChannelGroupObjectID,
  //     }).exec();
  //     expect(await Sport.countDocuments()).toEqual(initialSportCount);
  //     expect(await League.countDocuments()).toEqual(initialLeagueCount);
  //     expect(await Club.countDocuments()).toEqual(initialClubCount);
  //     expect(await LockerRoom.countDocuments()).toEqual(initialLockerRoomCount);
  //     expect(await ChannelGroup.countDocuments()).toEqual(
  //       initialChannelGroupCount
  //     );
  //     expect(await Channel.countDocuments()).toEqual(initialChannelCount);
  //     expect(await GroupAggregates.countDocuments()).toEqual(
  //       initialGroupAggregatesCount
  //     );
  //     expect(initialGrpAggSportClubsCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `Sport:${sportGroup}`,
  //       }).exec())!.clubs!
  //     );
  //     expect(initialGrpAggSportChannelGroupsCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `Sport:${sportGroup}`,
  //       }).exec())!.channelGroups!
  //     );
  //     expect(initialGrpAggSportChannelsCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `Sport:${sportGroup}`,
  //       }).exec())!.channels!
  //     );
  //     expect(initialGrpAggLeagueClubsCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `League:${league}`,
  //       }).exec())!.clubs!
  //     );
  //     expect(initialGrpAggLeagueChannelGroupsCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `League:${league}`,
  //       }).exec())!.channelGroups!
  //     );
  //     expect(initialGrpAggLeagueChannelsCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `League:${league}`,
  //       }).exec())!.channels!
  //     );
  //     expect(
  //       await LockerRoom.findById(newLockerRoomObjectID).exec()
  //     ).toBeNull();
  //     expect(
  //       await ChannelGroup.findById(newChannelGroupObjectID).exec()
  //     ).toBeNull();
  //     expect(
  //       (await Channel.find({channelGroupID: newChannelGroupObjectID}).exec())
  //         .length
  //     ).toEqual(0);
  //   }, 30000);
  // });
  describe('Test Editing of Club', () => {
    let initialSportCount = 0;
    let initialLeagueCount = 0;
    let initialClubCount = 0;
    let initialLockerRoomCount = 0;
    let initialChannelGroupCount = 0;
    let initialChannelCount = 0;
    let initialGroupAggregatesCount = 0;
    let initialGrpAggSportClubsCount = 0;
    let initialGrpAggLeagueClubsCount = 0;
    let initialGrpAggSportChannelGroupsCount = 0;
    let initialGrpAggSportChannelsCount = 0;
    let initialGrpAggLeagueChannelGroupsCount = 0;
    let initialGrpAggLeagueChannelsCount = 0;
    let newClubObjectID: string;
    let newClubSlug: string;
    let newLockerRoomObjectID: string;
    let newChannelGroupObjectID: string;

    let clubObjectIDsAfterAdding: string[];
    let clubCountAfterAdding = 0;

    it('1. Initialize', async () => {
      newClubObjectID = (
        await api.createClub({
          input: {
            Avatar: null,
            leagueID: league,
            name: 'test club edit',
            sportIDs: [sportGroup],
          },
        })
      ).result.objectID!;
      initialSportCount = await Sport.countDocuments();
      initialLeagueCount = await League.countDocuments();
      initialClubCount = await Club.countDocuments();
      initialLockerRoomCount = await LockerRoom.countDocuments();
      initialChannelGroupCount = await ChannelGroup.countDocuments();
      initialChannelCount = await Channel.countDocuments();
      initialGroupAggregatesCount = await GroupAggregates.countDocuments();

      initialGrpAggSportClubsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.clubs!;
      initialGrpAggLeagueClubsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.clubs!;
      initialGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      initialGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
      initialGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channelGroups!;
      initialGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channels!;

      clubObjectIDsAfterAdding = (await Club.find().exec()).map(
        (item: any) => item.id
      );
      clubCountAfterAdding = await Club.countDocuments();
      newClubSlug = (await Club.findById(newClubObjectID).exec())!.slug!;
      const defaultLockerRoom = await LockerRoom.findOne({
        group: `Club:${newClubObjectID}`,
      }).exec();
      newLockerRoomObjectID = defaultLockerRoom?.id.toString();
      const defaultChannelInformation = await ChannelGroup.findOne({
        group: `Club:${newClubObjectID}`,
      }).exec();
      newChannelGroupObjectID = defaultChannelInformation?.id.toString();
    }, 30000);
    it('2. Edit Club', async () => {
      const {result} = await api.editClub({
        id: newClubObjectID,
        input: {
          Avatar: null,
          leagueID: league,
          name: 'test club edit - edited',
          sportIDs: [sportGroup],
        },
      });
      expect(result.objectType).toEqual('Club');
      expect(result.success).toBeTruthy();
      expect(clubObjectIDsAfterAdding.includes(result.objectID!)).toBeTruthy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. Club entry should be retained', async () => {
      const getClub = await Club.findById(newClubObjectID).exec();
      expect(getClub).not.toBeNull();
    }, 30000);
    it("4. Club entry's name should be edited", async () => {
      const getClub = await Club.findById(newClubObjectID).exec();
      expect(getClub?.name).toEqual('test club edit - edited');
    }, 30000);
    it("5. Club entry's slug should be unchanged", async () => {
      const getClub = await Club.findOne({slug: newClubSlug}).exec();
      expect(getClub).not.toBeNull();
    }, 30000);
    it("6. Club collection's documents should not increment", async () => {
      const finalClubCount = await Club.countDocuments();
      expect(finalClubCount).toEqual(clubCountAfterAdding);
    }, 30000);
    it("7. GroupAggregates of chosen sport's club should not increment", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec();
      expect(findGroupAggregates?.clubs).toEqual(initialGrpAggSportClubsCount);
      expect(findGroupAggregates?.channelGroups).toEqual(
        initialGrpAggSportChannelGroupsCount
      );
      expect(findGroupAggregates?.channels).toEqual(
        initialGrpAggSportChannelsCount
      );
    }, 30000);
    it("8. GroupAggregates of created league's club should not increment", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec();
      expect(findGroupAggregates?.clubs).toEqual(initialGrpAggLeagueClubsCount);
      expect(findGroupAggregates?.channelGroups).toEqual(
        initialGrpAggLeagueChannelGroupsCount
      );
      expect(findGroupAggregates?.channels).toEqual(
        initialGrpAggLeagueChannelsCount
      );
    }, 30000);
    it('9. GroupAggregates should be retained', async () => {
      const findGroupAggregates = await GroupAggregates.find({
        group: `Club:${newClubObjectID}`,
      }).exec();
      expect(findGroupAggregates).not.toBeNull();
    }, 30000);
    it('10. Teardown', async () => {
      await Club.findByIdAndDelete(newClubObjectID).exec();
      await GroupAggregates.deleteMany({
        $or: [
          {group: `LockerRoom:${newLockerRoomObjectID}`},
          {group: `Club:${newClubObjectID}`},
        ],
      }).exec();
      await GroupAggregates.increment(`Sport:${sportGroup}`, {
        clubs: -1,
        channelGroups: -1,
        channels: -3,
      });
      await GroupAggregates.increment(`League:${league}`, {
        clubs: -1,
        channelGroups: -1,
        channels: -3,
      });
      await LockerRoom.findByIdAndDelete(newLockerRoomObjectID).exec();
      await ChannelGroup.findByIdAndDelete(newChannelGroupObjectID).exec();
      await Channel.deleteMany({
        channelGroupID: newChannelGroupObjectID,
      }).exec();
      expect(await Sport.countDocuments()).toEqual(initialSportCount);
      expect(await League.countDocuments()).toEqual(initialLeagueCount);
      expect(await Club.countDocuments()).toEqual(initialClubCount - 1);
      expect(await LockerRoom.countDocuments()).toEqual(
        initialLockerRoomCount - 1
      );
      expect(await ChannelGroup.countDocuments()).toEqual(
        initialChannelGroupCount - 1
      );
      expect(await Channel.countDocuments()).toEqual(initialChannelCount - 3);
      expect(await GroupAggregates.countDocuments()).toEqual(
        initialGroupAggregatesCount - 2
      );
      expect(initialGrpAggSportClubsCount - 1).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.clubs!
      );
      expect(initialGrpAggSportChannelGroupsCount - 1).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggSportChannelsCount - 3).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggLeagueClubsCount - 1).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.clubs!
      );
      expect(initialGrpAggLeagueChannelGroupsCount - 1).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggLeagueChannelsCount - 3).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channels!
      );
      expect(
        await LockerRoom.findById(newLockerRoomObjectID).exec()
      ).toBeNull();
      expect(
        await ChannelGroup.findById(newChannelGroupObjectID).exec()
      ).toBeNull();
      expect(
        (await Channel.find({channelGroupID: newChannelGroupObjectID}).exec())
          .length
      ).toEqual(0);
    }, 30000);
  });
  describe('Test Querying of Club', () => {
    let initialClubObjectIDs: string[];
    let initialSportCount = 0;
    let initialLeagueCount = 0;
    let initialClubCount = 0;
    let initialLockerRoomCount = 0;
    let initialChannelGroupCount = 0;
    let initialChannelCount = 0;
    let initialGroupAggregatesCount = 0;
    let initialGrpAggSportClubsCount = 0;
    let initialGrpAggLeagueClubsCount = 0;
    let initialGrpAggSportChannelGroupsCount = 0;
    let initialGrpAggSportChannelsCount = 0;
    let initialGrpAggLeagueChannelGroupsCount = 0;
    let initialGrpAggLeagueChannelsCount = 0;
    let newClubObjectID: string;
    let newLockerRoomObjectID: string;
    let newChannelGroupObjectID: string;
    it('1. Initialize', async () => {
      initialClubObjectIDs = (await Club.find().exec()).map(
        (item: any) => item.id
      );
      initialSportCount = await Sport.countDocuments();
      initialLeagueCount = await League.countDocuments();
      initialClubCount = await Club.countDocuments();
      initialLockerRoomCount = await LockerRoom.countDocuments();
      initialChannelGroupCount = await ChannelGroup.countDocuments();
      initialChannelCount = await Channel.countDocuments();
      initialGroupAggregatesCount = await GroupAggregates.countDocuments();
      initialGrpAggSportClubsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.clubs!;
      initialGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      initialGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
      initialGrpAggLeagueClubsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.clubs!;
      initialGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channelGroups!;
      initialGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channels!;
    }, 30000);
    it('2. Create Club', async () => {
      const {result} = await api.createClub({
        input: {
          Avatar: null,
          leagueID: league,
          name: 'test club',
          sportIDs: [sportGroup],
        },
      });
      newClubObjectID = result.objectID!;
      const defaultLockerRoom = await LockerRoom.findOne({
        group: `Club:${newClubObjectID}`,
      }).exec();
      newLockerRoomObjectID = defaultLockerRoom?.id.toString();
      const defaultChannelInformation = await ChannelGroup.findOne({
        group: `Club:${newClubObjectID}`,
      }).exec();
      newChannelGroupObjectID = defaultChannelInformation?.id.toString();
      expect(result.objectType).toEqual('Club');
      expect(result.success).toBeTruthy();
      expect(initialClubObjectIDs.includes(result.objectID!)).toBeFalsy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. Club can be queried by id', async () => {
      const {result} = await api.getClub({
        id: newClubObjectID,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('4. Club can be queried by slug', async () => {
      const {result} = await api.getClub({
        slug: 'test-club',
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('5. Result should be null when neither id nor slug is provided', async () => {
      const {result} = await api.getClub({
        id: null,
        slug: null,
      });
      expect(result).toBeNull();
    }, 30000);
    it('6. All clubs can be queried', async () => {
      const {result} = await api.getClubs();
      expect(result).not.toBeNull();
      expect(result.total).toEqual(result?.items?.length);
    }, 30000);
    it('8. Teardown', async () => {
      await Club.findByIdAndDelete(newClubObjectID).exec();
      await GroupAggregates.deleteMany({
        $or: [
          {group: `LockerRoom:${newLockerRoomObjectID}`},
          {group: `Club:${newClubObjectID}`},
        ],
      }).exec();
      await GroupAggregates.increment(`Sport:${sportGroup}`, {
        clubs: -1,
        channelGroups: -1,
        channels: -3,
      });
      await GroupAggregates.increment(`League:${league}`, {
        clubs: -1,
        channelGroups: -1,
        channels: -3,
      });
      await LockerRoom.findByIdAndDelete(newLockerRoomObjectID).exec();
      await ChannelGroup.findByIdAndDelete(newChannelGroupObjectID).exec();
      await Channel.deleteMany({
        channelGroupID: newChannelGroupObjectID,
      }).exec();
      expect(await Sport.countDocuments()).toEqual(initialSportCount);
      expect(await League.countDocuments()).toEqual(initialLeagueCount);
      expect(await Club.countDocuments()).toEqual(initialClubCount);
      expect(await LockerRoom.countDocuments()).toEqual(initialLockerRoomCount);
      expect(await ChannelGroup.countDocuments()).toEqual(
        initialChannelGroupCount
      );
      expect(await Channel.countDocuments()).toEqual(initialChannelCount);
      expect(await GroupAggregates.countDocuments()).toEqual(
        initialGroupAggregatesCount
      );
      expect(initialGrpAggSportClubsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.clubs!
      );
      expect(initialGrpAggSportChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggSportChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggLeagueClubsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.clubs!
      );
      expect(initialGrpAggLeagueChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggLeagueChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channels!
      );
      expect(await Club.findById(newClubObjectID).exec()).toBeNull();
      expect(
        await LockerRoom.findById(newLockerRoomObjectID).exec()
      ).toBeNull();
      expect(
        await ChannelGroup.findById(newChannelGroupObjectID).exec()
      ).toBeNull();
      expect(
        (await Channel.find({channelGroupID: newChannelGroupObjectID}).exec())
          .length
      ).toEqual(0);
    }, 30000);
  });
};
