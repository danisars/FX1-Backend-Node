import {GraphQLClient} from 'graphql-request';
import {getSdk} from '../types/graphql';
import {
  Channel,
  ChannelGroup,
  GroupAggregates,
  League,
  LockerRoom,
  Sport,
} from 'lib-mongoose';

const url = 'http://localhost:8080/graphql';
let api: ReturnType<typeof getSdk>;
let sportGroup: string;

beforeAll(async () => {
  const client = new GraphQLClient(url);
  api = getSdk(client);
  sportGroup = (await Sport.find().exec())[0].id;
});

export default () => {
  describe('4. Test Creation of League', () => {
    let initialLeagueObjectIDs: string[];
    let initialLeaguesCount = 0;
    let initialGroupAggregatesCount = 0;
    let initialGrpAggSportLeaguesCount = 0;
    let initialGrpAggSportChannelGroupsCount = 0;
    let initialGrpAggSportChannelsCount = 0;
    let newLeagueObjectID: string;
    let newLockerRoomObjectID: string;
    let newChannelGroupObjectID: string;

    it('1. Initialize', async () => {
      initialLeagueObjectIDs = (await League.find().exec()).map(
        (item: any) => item.id
      );
      initialLeaguesCount = await League.countDocuments();
      initialGroupAggregatesCount = await GroupAggregates.countDocuments();
      initialGrpAggSportLeaguesCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.leagues!;
      initialGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      initialGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
    }, 30000);
    it('2. Create League', async () => {
      const {result} = await api.createLeague({
        input: {
          name: 'TestLeague',
          sportIDs: [sportGroup],
          Avatar: {
            objectID: 'basketball',
            objectType: 'Photo',
          },
          CoverPhoto: {
            objectID: 'basketball',
            objectType: 'Photo',
          },
        },
      });
      newLeagueObjectID = result.objectID!;
      expect(result.objectType).toEqual('League');
      expect(result.success).toBeTruthy();
      expect(initialLeagueObjectIDs.includes(result.objectID!)).toBeFalsy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. League entry should be created', async () => {
      const getNewLeague = await League.findById(newLeagueObjectID).exec();
      expect(getNewLeague).not.toBeNull();
    }, 30000);
    it("4. League collection's documents should increment by at least 1", async () => {
      const finalLeaguesCount = await League.countDocuments();
      expect(finalLeaguesCount).toBeGreaterThan(initialLeaguesCount);
    }, 30000);
    it('5. GroupAggregates should be created', async () => {
      const findGroupAggregates = await GroupAggregates.find({
        group: `League:${newLeagueObjectID}`,
      }).exec();
      expect(findGroupAggregates).not.toBeNull();
    }, 30000);
    it('6. GroupAggregates should be added on Sport for League', async () => {
      const finalGrpAggSportLeaguesCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.leagues!;

      expect(initialGrpAggSportLeaguesCount + 1).toEqual(
        finalGrpAggSportLeaguesCount
      );
    }, 30000);
    it('7. GroupAggregates should be added on Sport for Channel Groups', async () => {
      const finalGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne(
        {
          group: `Sport:${sportGroup}`,
        }
      ).exec())!.channelGroups!;

      expect(initialGrpAggSportChannelGroupsCount + 1).toEqual(
        finalGrpAggSportChannelGroupsCount
      );
    }, 30000);
    it('8. GroupAggregates should be added on Sport for Channels', async () => {
      const finalGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;

      expect(initialGrpAggSportChannelsCount + 3).toEqual(
        finalGrpAggSportChannelsCount
      );
    }, 30000);
    it('9. Default Locker Room should be created', async () => {
      const defaultLockerRoom = await LockerRoom.findOne({
        group: `League:${newLeagueObjectID}`,
      }).exec();
      expect(defaultLockerRoom).not.toBeNull();
      newLockerRoomObjectID = defaultLockerRoom?.id.toString();
    }, 30000);
    it('10. Default ChannelGroup should be created', async () => {
      const defaultChannelInformation = await ChannelGroup.findOne({
        group: `League:${newLeagueObjectID}`,
      }).exec();
      expect(defaultChannelInformation).not.toBeNull();
      newChannelGroupObjectID = defaultChannelInformation?.id.toString();
    }, 30000);
    it('11. Default Channels should be created', async () => {
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
    it('12. Teardown', async () => {
      await League.findByIdAndDelete(newLeagueObjectID).exec();
      await GroupAggregates.deleteMany({
        group: `League:${newLeagueObjectID}`,
      }).exec();
      await GroupAggregates.deleteMany({
        group: `LockerRoom:${newLockerRoomObjectID}`,
      }).exec();
      await GroupAggregates.increment(`Sport:${sportGroup}`, {
        leagues: -1,
        channelGroups: -1,
        channels: -3,
      });
      await LockerRoom.findByIdAndDelete(newLockerRoomObjectID).exec();
      await ChannelGroup.findByIdAndDelete(newChannelGroupObjectID).exec();
      await Channel.deleteMany({
        channelGroupID: newChannelGroupObjectID,
      }).exec();
      expect(await League.countDocuments()).toEqual(initialLeaguesCount);
      expect(await GroupAggregates.countDocuments()).toEqual(
        initialGroupAggregatesCount
      );
      expect(initialGrpAggSportLeaguesCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.leagues!
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

  describe('5. Test Editing of League (Name)', () => {
    let initialLeaguesCount = 0;
    let leagueObjectIDsAfterAdding: string[];
    let leaguesCountAfterAdding = 0;
    let newLeagueObjectID: string;
    let newLeagueSlug: string;
    let initialGroupAggregatesCount = 0;
    let initialGrpAggSportLeaguesCount = 0;
    let initialGrpAggSportChannelGroupsCount = 0;
    let initialGrpAggSportChannelsCount = 0;
    let newLockerRoomObjectID: string;
    let newChannelGroupObjectID: string;

    it('1. Initialize', async () => {
      initialLeaguesCount = await League.countDocuments();
      initialGroupAggregatesCount = await GroupAggregates.countDocuments();
      initialGrpAggSportLeaguesCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.leagues!;
      initialGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      initialGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
      const {result} = await api.createLeague({
        input: {
          name: 'TestLeague',
          sportIDs: [sportGroup],
          Avatar: {
            objectID: 'basketball',
            objectType: 'Photo',
          },
          CoverPhoto: {
            objectID: 'basketball',
            objectType: 'Photo',
          },
        },
      });
      newLeagueObjectID = result.objectID!;
      leagueObjectIDsAfterAdding = (await League.find().exec()).map(
        (item: any) => item.id
      );
      leaguesCountAfterAdding = await League.countDocuments();
      newLeagueSlug = (await League.findById(newLeagueObjectID).exec())!.slug!;
      newLockerRoomObjectID = (
        await LockerRoom.findOne({
          group: `League:${newLeagueObjectID}`,
        }).exec()
      )?.id.toString();
      newChannelGroupObjectID = (
        await ChannelGroup.findOne({
          lockerRoomID: newLockerRoomObjectID,
        }).exec()
      )?.id.toString();
    }, 30000);
    it('2. Edit League Name', async () => {
      const {result} = await api.editLeague({
        id: newLeagueObjectID,
        input: {
          name: 'TestLeague - edited',
          sportIDs: [sportGroup],
        },
      });
      expect(result.objectType).toEqual('League');
      expect(result.success).toBeTruthy();
      expect(
        leagueObjectIDsAfterAdding.includes(result.objectID!)
      ).toBeTruthy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. League entry should be retained', async () => {
      const getLeague = await League.findById(newLeagueObjectID).exec();
      expect(getLeague).not.toBeNull();
    }, 30000);
    it("4. League entry's name should be edited", async () => {
      const getLeague = await League.findById(newLeagueObjectID).exec();
      expect(getLeague?.name).toEqual('TestLeague - edited');
    }, 30000);
    it("5. Default Locker Room's name should be edited", async () => {
      const getLockerRoom = await LockerRoom.findOne({
        group: `League:${newLeagueObjectID}`,
      }).exec();
      expect(getLockerRoom?.name).toEqual('TestLeague - edited');
    }, 30000);
    it("6. League entry's slug should be unchanged", async () => {
      const getLeague = await League.findOne({slug: newLeagueSlug}).exec();
      expect(getLeague).not.toBeNull();
    }, 30000);
    it("7. League collection's documents should not increment", async () => {
      const finalLeaguesCount = await League.countDocuments();
      expect(finalLeaguesCount).toEqual(leaguesCountAfterAdding);
    }, 30000);
    it('8. GroupAggregates should be retained', async () => {
      const findGroupAggregates = await GroupAggregates.find({
        group: `League:${newLeagueObjectID}`,
      }).exec();
      expect(findGroupAggregates).not.toBeNull();

      const finalGrpAggLeagueCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.leagues!;

      const finalGrpAggChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;

      const finalGrpAggChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;

      // +1 beacuse of default locker room
      expect(initialGrpAggSportLeaguesCount + 1).toEqual(
        finalGrpAggLeagueCount
      );
      // +1 beacuse of default channel group
      expect(initialGrpAggSportChannelGroupsCount + 1).toEqual(
        finalGrpAggChannelGroupsCount
      );
      // +3 beacuse of default channels
      expect(initialGrpAggSportChannelsCount + 3).toEqual(
        finalGrpAggChannelsCount
      );
    }, 30000);
    it('9. Teardown', async () => {
      await League.findByIdAndDelete(newLeagueObjectID).exec();
      await GroupAggregates.deleteMany({
        group: `League:${newLeagueObjectID}`,
      }).exec();
      await GroupAggregates.deleteMany({
        group: `LockerRoom:${newLockerRoomObjectID}`,
      }).exec();
      await GroupAggregates.increment(`Sport:${sportGroup}`, {
        leagues: -1,
        channelGroups: -1,
        channels: -3,
      });
      await LockerRoom.findByIdAndDelete(newLockerRoomObjectID).exec();
      await ChannelGroup.findByIdAndDelete(newChannelGroupObjectID).exec();
      await Channel.deleteMany({
        channelGroupID: newChannelGroupObjectID,
      }).exec();
      expect(await League.countDocuments()).toEqual(initialLeaguesCount);
      expect(await GroupAggregates.countDocuments()).toEqual(
        initialGroupAggregatesCount
      );
      expect(initialGrpAggSportLeaguesCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.leagues!
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
  // describe('6. Test Editing of League (Sports)', () => {
  //   let initialLeaguesCount = 0;
  //   let finalLeaguesCount = 0;
  //   let newSportObjectID: string;
  //   let initialGroupAggregatesCount = 0;
  //   let initialGrpAggSportLeaguesCount = 0;
  //   let initialGrpAggSportClubsCount = 0;
  //   let initialGrpAggSportChannelGroupsCount = 0;
  //   let initialGrpAggSportChannelsCount = 0;
  //   let initialGrpAggSportSupportersCount = 0;
  //   let initialGrpAggNewSportLeaguesCount = 0;
  //   let initialGrpAggNewSportClubsCount = 0;
  //   let initialGrpAggNewSportChannelGroupsCount = 0;
  //   let initialGrpAggNewSportChannelsCount = 0;
  //   let initialGrpAggNewSportSupportersCount = 0;
  //   let initialGrpAggLeagueClubsCount = 0;
  //   let initialGrpAggLeagueChannelGroupsCount = 0;
  //   let initialGrpAggLeagueChannelsCount = 0;
  //   let initialGrpAggLeagueSupportersCount = 0;
  //   let initialGrpAggClubChannelGroupsCount = 0;
  //   let initialGrpAggClubChannelsCount = 0;
  //   let initialGrpAggClubSupportersCount = 0;
  //   let initialSportObjectIDs: string[];
  //   let initialSportsCount = 0;
  //   let leagueObjectID: string;
  //   let leagueName: string;
  //   let leagueSlug: string;
  //   let clubSlug: string;
  //   let club: string;
  //
  //   it('1. Initialize', async () => {
  //     initialLeaguesCount = await League.countDocuments();
  //     leagueObjectID = (await League.findOne({
  //       sportIDs: `${sportGroup}`,
  //     }).exec())!.id!;
  //     leagueName = (await League.findById(leagueObjectID).exec())!.name!;
  //     leagueSlug = (await League.findById(leagueObjectID).exec())!.slug!;
  //     initialSportsCount = await Sport.countDocuments();
  //     initialSportObjectIDs = (await Sport.find().exec()).map(
  //       (item: any) => item.id
  //     );
  //     club = (await Club.findOne({
  //       sportIDs: `${sportGroup}`,
  //       leagueID: `${leagueObjectID}`,
  //     }).exec())!.id!;
  //     clubSlug = (await Club.findById(club).exec())!.slug!;
  //     initialGroupAggregatesCount = await GroupAggregates.countDocuments();
  //     initialGrpAggSportLeaguesCount = (await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec())!.leagues!;
  //     initialGrpAggSportClubsCount = (await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec())!.clubs!;
  //     initialGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec())!.channelGroups!;
  //     initialGrpAggSportChannelsCount = (await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec())!.channels!;
  //     initialGrpAggSportSupportersCount = (await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec())!.supporters!;
  //     initialGrpAggLeagueClubsCount = (await GroupAggregates.findOne({
  //       group: `League:${leagueObjectID}`,
  //     }).exec())!.clubs!;
  //     initialGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
  //       group: `League:${leagueObjectID}`,
  //     }).exec())!.channelGroups!;
  //     initialGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
  //       group: `League:${leagueObjectID}`,
  //     }).exec())!.channels!;
  //     initialGrpAggLeagueSupportersCount = (await GroupAggregates.findOne({
  //       group: `League:${leagueObjectID}`,
  //     }).exec())!.supporters!;
  //     initialGrpAggClubChannelGroupsCount = (await GroupAggregates.findOne({
  //       group: `Club:${club}`,
  //     }).exec())!.channelGroups!;
  //     initialGrpAggClubChannelsCount = (await GroupAggregates.findOne({
  //       group: `Club:${club}`,
  //     }).exec())!.channels!;
  //     initialGrpAggClubSupportersCount = (await GroupAggregates.findOne({
  //       group: `Club:${club}`,
  //     }).exec())!.supporters!;
  //
  //     const {result} = await api.createSport({
  //       input: {
  //         name: 'Sport',
  //         Avatar: {
  //           objectID: 'basketball',
  //           objectType: 'Photo',
  //         },
  //         CoverPhoto: {
  //           objectID: 'basketball',
  //           objectType: 'Photo',
  //         },
  //       },
  //     });
  //
  //     newSportObjectID = result.objectID!;
  //     expect(result.objectType).toEqual('Sport');
  //     expect(result.success).toBeTruthy();
  //     expect(initialSportObjectIDs.includes(result.objectID!)).toBeFalsy();
  //     expect(result.timestamp).not.toBeNull();
  //   }, 30000);
  //   it('2. Edit League Associated Sport', async () => {
  //     const {result} = await api.editLeague({
  //       id: leagueObjectID,
  //       input: {
  //         name: leagueName,
  //         sportIDs: [newSportObjectID],
  //       },
  //     });
  //
  //     finalLeaguesCount = await League.countDocuments();
  //     initialGrpAggNewSportLeaguesCount = (await GroupAggregates.findOne({
  //       group: `Sport:${newSportObjectID}`,
  //     }).exec())!.leagues!;
  //     initialGrpAggNewSportClubsCount = (await GroupAggregates.findOne({
  //       group: `Sport:${newSportObjectID}`,
  //     }).exec())!.clubs!;
  //     initialGrpAggNewSportChannelGroupsCount = (await GroupAggregates.findOne({
  //       group: `Sport:${newSportObjectID}`,
  //     }).exec())!.channelGroups!;
  //     initialGrpAggNewSportChannelsCount = (await GroupAggregates.findOne({
  //       group: `Sport:${newSportObjectID}`,
  //     }).exec())!.channels!;
  //     initialGrpAggNewSportSupportersCount = (await GroupAggregates.findOne({
  //       group: `Sport:${newSportObjectID}`,
  //     }).exec())!.supporters!;
  //
  //     expect(initialLeaguesCount).toEqual(finalLeaguesCount);
  //     expect(result.objectType).toEqual('League');
  //     expect(result.success).toBeTruthy();
  //     expect(leagueObjectID).toEqual(result.objectID!);
  //     expect(result.timestamp).not.toBeNull();
  //   }, 30000);
  //   it('3. League entry should be retained', async () => {
  //     const getLeague = await League.findById(leagueObjectID).exec();
  //     expect(getLeague).not.toBeNull();
  //   }, 30000);
  //   it("4. League entry's associated Sport should be edited", async () => {
  //     const getLeague = await League.findById(leagueObjectID).exec();
  //     expect(getLeague?.sportIDs).toContain(newSportObjectID);
  //   }, 30000);
  //   it("5. League entry's name and slug should not be edited", async () => {
  //     const getLeague = await League.findById(leagueObjectID).exec();
  //     expect(getLeague?.name).toEqual(leagueName);
  //     expect(getLeague?.slug).toEqual(leagueSlug);
  //   }, 30000);
  //   it("6. Default Locker Room's name should not be edited", async () => {
  //     const getLockerRoom = await LockerRoom.findOne({
  //       group: `League:${leagueObjectID}`,
  //     }).exec();
  //     expect(getLockerRoom?.name).toEqual(leagueName);
  //   }, 30000);
  //   it("7. League collection's documents should not increment", async () => {
  //     const finalLeaguesCount = await League.countDocuments();
  //     expect(finalLeaguesCount).toEqual(initialLeaguesCount);
  //   }, 30000);
  //   it('8. Club under the League should also have an updated Associated Sport', async () => {
  //     const getCub = await Club.find({
  //       leagueID: leagueObjectID,
  //       sportIDs: newSportObjectID,
  //     }).exec();
  //     expect(getCub).not.toBeNull();
  //   }, 30000);
  //   it('9. GroupAggregates of the League and Club should be retained', async () => {
  //     const findGroupAggregates = await GroupAggregates.find({
  //       group: `League:${leagueObjectID}`,
  //     }).exec();
  //     expect(findGroupAggregates).not.toBeNull();
  //
  //     const findClubGroupAggregates = await GroupAggregates.find({
  //       group: `Club:${club}`,
  //     }).exec();
  //     expect(findClubGroupAggregates).not.toBeNull();
  //
  //     const finalGrpAggLeagueClubsCount = (await GroupAggregates.findOne({
  //       group: `League:${leagueObjectID}`,
  //     }).exec())!.clubs!;
  //     const finalGrpAggLeagueChannelGroupsCount =
  //       (await GroupAggregates.findOne({
  //         group: `League:${leagueObjectID}`,
  //       }).exec())!.channelGroups!;
  //     const finalGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
  //       group: `League:${leagueObjectID}`,
  //     }).exec())!.channels!;
  //     const finalGrpAggLeagueSupportersCount = (await GroupAggregates.findOne({
  //       group: `League:${leagueObjectID}`,
  //     }).exec())!.supporters!;
  //     const finalGrpAggClubChannelGroupsCount = (await GroupAggregates.findOne({
  //       group: `Club:${club}`,
  //     }).exec())!.channelGroups!;
  //     const finalGrpAggClubChannelsCount = (await GroupAggregates.findOne({
  //       group: `Club:${club}`,
  //     }).exec())!.channels!;
  //     const finalGrpAggClubSupportersCount = (await GroupAggregates.findOne({
  //       group: `Club:${club}`,
  //     }).exec())!.supporters!;
  //
  //     expect(initialGrpAggLeagueClubsCount).toEqual(
  //       finalGrpAggLeagueClubsCount
  //     );
  //     expect(initialGrpAggLeagueChannelGroupsCount).toEqual(
  //       finalGrpAggLeagueChannelGroupsCount
  //     );
  //     expect(initialGrpAggLeagueChannelsCount).toEqual(
  //       finalGrpAggLeagueChannelsCount
  //     );
  //     expect(initialGrpAggLeagueSupportersCount).toEqual(
  //       finalGrpAggLeagueSupportersCount
  //     );
  //     expect(initialGrpAggClubChannelGroupsCount).toEqual(
  //       finalGrpAggClubChannelGroupsCount
  //     );
  //     expect(initialGrpAggClubChannelsCount).toEqual(
  //       finalGrpAggClubChannelsCount
  //     );
  //     expect(initialGrpAggClubSupportersCount).toEqual(
  //       finalGrpAggClubSupportersCount
  //     );
  //   }, 30000);
  //   it('10. GroupAggregates of Original Sport should be updated for both League and Club', async () => {
  //     const finalGrpAggSportLeaguesCount = (await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec())!.leagues!;
  //     const finalGrpAggSportClubsCount = (await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec())!.clubs!;
  //     const finalGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne(
  //       {
  //         group: `Sport:${sportGroup}`,
  //       }
  //     ).exec())!.channelGroups!;
  //     const finalGrpAggSportChannelsCount = (await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec())!.channels!;
  //     const finalGrpAggSportSupportersCount = (await GroupAggregates.findOne({
  //       group: `Sport:${sportGroup}`,
  //     }).exec())!.supporters!;
  //
  //     expect(initialGrpAggSportLeaguesCount - 1).toEqual(
  //       finalGrpAggSportLeaguesCount
  //     );
  //     expect(initialGrpAggSportClubsCount - 1).toEqual(
  //       finalGrpAggSportClubsCount
  //     );
  //     expect(
  //       initialGrpAggSportChannelGroupsCount -
  //         initialGrpAggLeagueChannelGroupsCount
  //     ).toEqual(finalGrpAggSportChannelGroupsCount);
  //     expect(
  //       initialGrpAggSportChannelsCount - initialGrpAggLeagueChannelsCount
  //     ).toEqual(finalGrpAggSportChannelsCount);
  //     expect(
  //       initialGrpAggSportSupportersCount - initialGrpAggLeagueSupportersCount
  //     ).toEqual(finalGrpAggSportSupportersCount);
  //   }, 30000);
  //   it('11. GroupAggregates of New Associated Sport should be include both League and Club', async () => {
  //     const finalGrpAggSportLeaguesCount = (await GroupAggregates.findOne({
  //       group: `Sport:${newSportObjectID}`,
  //     }).exec())!.leagues!;
  //     const finalGrpAggSportClubsCount = (await GroupAggregates.findOne({
  //       group: `Sport:${newSportObjectID}`,
  //     }).exec())!.clubs!;
  //     const finalGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne(
  //       {
  //         group: `Sport:${newSportObjectID}`,
  //       }
  //     ).exec())!.channelGroups!;
  //     const finalGrpAggSportChannelsCount = (await GroupAggregates.findOne({
  //       group: `Sport:${newSportObjectID}`,
  //     }).exec())!.channels!;
  //     const finalGrpAggSportSupportersCount = (await GroupAggregates.findOne({
  //       group: `Sport:${newSportObjectID}`,
  //     }).exec())!.supporters!;
  //
  //     expect(initialGrpAggNewSportLeaguesCount).toEqual(
  //       finalGrpAggSportLeaguesCount
  //     );
  //     expect(initialGrpAggNewSportClubsCount).toEqual(
  //       finalGrpAggSportClubsCount
  //     );
  //     expect(initialGrpAggNewSportChannelGroupsCount).toEqual(
  //       finalGrpAggSportChannelGroupsCount
  //     );
  //     expect(initialGrpAggNewSportChannelsCount).toEqual(
  //       finalGrpAggSportChannelsCount
  //     );
  //     expect(initialGrpAggNewSportSupportersCount).toEqual(
  //       finalGrpAggSportSupportersCount
  //     );
  //   }, 30000);
  //   it('12. Teardown', async () => {
  //     await League.updateOne({slug: leagueSlug}, {sportIDs: sportGroup}).exec();
  //     await Club.updateOne({slug: clubSlug}, {sportIDs: sportGroup}).exec();
  //     await Sport.findByIdAndDelete(newSportObjectID).exec();
  //     await GroupAggregates.deleteMany({
  //       group: `Sport:${newSportObjectID}`,
  //     }).exec();
  //     await GroupAggregates.increment(`Sport:${sportGroup}`, {
  //       leagues: 1,
  //       clubs: 1,
  //       channelGroups: 2,
  //       channels: 6,
  //       supporters: 3,
  //     });
  //
  //     expect(await Sport.countDocuments()).toEqual(initialSportsCount);
  //     expect(await GroupAggregates.countDocuments()).toEqual(
  //       initialGroupAggregatesCount
  //     );
  //     expect(await Sport.findById(newSportObjectID).exec()).toBeNull();
  //     expect(initialGrpAggSportLeaguesCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `Sport:${sportGroup}`,
  //       }).exec())!.leagues!
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
  //     expect(initialGrpAggSportSupportersCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `Sport:${sportGroup}`,
  //       }).exec())!.supporters!
  //     );
  //     expect(initialGrpAggLeagueClubsCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `League:${leagueObjectID}`,
  //       }).exec())!.clubs!
  //     );
  //     expect(initialGrpAggLeagueChannelGroupsCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `League:${leagueObjectID}`,
  //       }).exec())!.channelGroups!
  //     );
  //     expect(initialGrpAggLeagueChannelsCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `League:${leagueObjectID}`,
  //       }).exec())!.channels!
  //     );
  //     expect(initialGrpAggLeagueSupportersCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `League:${leagueObjectID}`,
  //       }).exec())!.supporters!
  //     );
  //     expect(initialGrpAggClubChannelGroupsCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `Club:${club}`,
  //       }).exec())!.channelGroups!
  //     );
  //     expect(initialGrpAggClubChannelsCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `Club:${club}`,
  //       }).exec())!.channels!
  //     );
  //     expect(initialGrpAggClubSupportersCount).toEqual(
  //       (await GroupAggregates.findOne({
  //         group: `Club:${club}`,
  //       }).exec())!.supporters!
  //     );
  //   }, 30000);
  // });

  describe('6. Test Querying of League', () => {
    let initialLeagueObjectIDs: string[];
    let initialLeaguesCount = 0;
    let newLeagueObjectID: string;
    let initialGroupAggregatesCount = 0;
    let initialGrpAggSportLeaguesCount = 0;
    let newLockerRoomObjectID: string;
    let newChannelGroupObjectID: string;

    it('1. Initialize', async () => {
      initialLeagueObjectIDs = (await League.find().exec()).map(
        (item: any) => item.id
      );
      initialLeaguesCount = await League.countDocuments();
      initialGroupAggregatesCount = await GroupAggregates.countDocuments();
      initialGrpAggSportLeaguesCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.leagues!;
    }, 30000);
    it('2. Create League', async () => {
      const {result} = await api.createLeague({
        input: {
          name: 'TestLeague',
          sportIDs: [sportGroup],
        },
      });
      newLeagueObjectID = result.objectID!;
      expect(result.objectType).toEqual('League');
      expect(result.success).toBeTruthy();
      expect(initialLeagueObjectIDs.includes(result.objectID!)).toBeFalsy();
      expect(result.timestamp).not.toBeNull();
      const defaultLockerRoom = await LockerRoom.findOne({
        group: `League:${newLeagueObjectID}`,
      }).exec();
      newLockerRoomObjectID = defaultLockerRoom?.id.toString();
      const defaultChannelInformation = await ChannelGroup.findOne({
        group: `League:${newLeagueObjectID}`,
      }).exec();
      newChannelGroupObjectID = defaultChannelInformation?.id.toString();
    }, 30000);
    it('3. League can be queried by id', async () => {
      const {result} = await api.getLeague({
        id: newLeagueObjectID,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('4. League can be queried by slug', async () => {
      const {result} = await api.getLeague({
        slug: 'test-league',
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('5. Result should be null when neither id nor slug is provided', async () => {
      const {result} = await api.getLeague({
        id: null,
        slug: null,
      });
      expect(result).toBeNull();
    }, 30000);
    it('6. All League can be queried', async () => {
      const {result} = await api.getLeagues();
      expect(result).not.toBeNull();
      expect(result.total).toEqual(result?.items?.length);
    }, 30000);
    it('7. Teardown', async () => {
      await League.findByIdAndDelete(newLeagueObjectID).exec();
      await GroupAggregates.deleteMany({
        group: `League:${newLeagueObjectID}`,
      }).exec();
      await GroupAggregates.deleteMany({
        group: `LockerRoom:${newLockerRoomObjectID}`,
      }).exec();
      await GroupAggregates.increment(`Sport:${sportGroup}`, {
        leagues: -1,
        channelGroups: -1,
        channels: -3,
      });
      await LockerRoom.findByIdAndDelete(newLockerRoomObjectID).exec();
      await ChannelGroup.findByIdAndDelete(newChannelGroupObjectID).exec();
      await Channel.deleteMany({
        channelGroupID: newChannelGroupObjectID,
      }).exec();
      expect(await League.countDocuments()).toEqual(initialLeaguesCount);
      expect(await GroupAggregates.countDocuments()).toEqual(
        initialGroupAggregatesCount
      );
      expect(initialGrpAggSportLeaguesCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.leagues!
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
};
