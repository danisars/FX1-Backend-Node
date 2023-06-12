import {GraphQLClient} from 'graphql-request';
import {getSdk} from '../types/graphql';
import {GroupAggregates, Sport} from 'lib-mongoose';
// import {FirebaseApp, initializeApp} from 'firebase/app';
// import firebaseConfig from '../utilities/firebase.json';
// import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import globalSetup from '../utilities/globalSetup';

const url = 'http://localhost:8080/graphql';
// let firebaseApp: FirebaseApp;
// let authToken: String;
let api: ReturnType<typeof getSdk>;
// const email = 'automatedtester1@fx1.io';
// const password = 'p588w012D';
// const email = 'automatedtester2@fx1.io';
// const password = 'p588w012D';
beforeAll(async () => {
  await globalSetup();
  const client = new GraphQLClient(url);
  api = getSdk(client);
});

// beforeAll(async () => {
//   firebaseApp = initializeApp(firebaseConfig);
//   const {user} = await signInWithEmailAndPassword(
//     getAuth(firebaseApp),
//     email,
//     password
//   );
//   authToken = await user.getIdToken(true);
//   const client = new GraphQLClient(url);
//   api = getSdk(client);
//   // connect();
// });
//
// afterAll(async () => {
//   disconnect();
// });

export default () => {
  describe('1. Test Creation of Sport', () => {
    let initialSportObjectIDs: string[];
    let newSportObjectID: string;
    let initialSportsCount = 0;
    let initialGroupAggregatesCount = 0;
    it('1. Initialize', async () => {
      initialSportObjectIDs = (await Sport.find().exec()).map(
        (item: any) => item.id
      );
      initialSportsCount = await Sport.countDocuments();
      initialGroupAggregatesCount = await GroupAggregates.countDocuments();
    }, 30000);
    it('2. Create Sport', async () => {
      const {result} = await api.createSport({
        input: {
          name: 'Sport',
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
      newSportObjectID = result.objectID!;
      expect(result.objectType).toEqual('Sport');
      expect(result.success).toBeTruthy();
      expect(initialSportObjectIDs.includes(result.objectID!)).toBeFalsy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. Sport entry should be created', async () => {
      const getNewSport = await Sport.findById(newSportObjectID).exec();
      expect(getNewSport).not.toBeNull();
    }, 30000);
    it('4. Sport entry should have an Avatar', async () => {
      const getNewSportAvatar = (await Sport.findById(newSportObjectID).exec())!
        .Avatar!;
      expect(getNewSportAvatar).not.toBeNull();
    }, 30000);
    it('5. Sport entry should have a Cover Photo', async () => {
      const getNewSportCoverPhoto = (await Sport.findById(
        newSportObjectID
      ).exec())!.CoverPhoto!;
      expect(getNewSportCoverPhoto).not.toBeNull();
    }, 30000);
    it('6. Sport entry should have a Status', async () => {
      const getNewSportStatus = (await Sport.findById(newSportObjectID).exec())!
        .status!;
      expect(getNewSportStatus).not.toBeNull();
    }, 30000);
    it("7. Sport collection's documents should increment by atleast 1", async () => {
      const finalSportsCount = await Sport.countDocuments();
      expect(finalSportsCount).toBeGreaterThan(initialSportsCount);
    }, 30000);
    it('8. GroupAggregates should be created', async () => {
      const findGroupAggregates = await GroupAggregates.find({
        group: `Sport:${newSportObjectID}`,
      }).exec();
      expect(findGroupAggregates).not.toBeNull();
    }, 30000);
    it("9. GroupAggregates collection's documents should increment by atleast 1", async () => {
      const finalGroupAggregatesCount = await GroupAggregates.countDocuments();
      expect(finalGroupAggregatesCount).toBeGreaterThan(
        initialGroupAggregatesCount
      );
    }, 30000);
    it('10. Teardown', async () => {
      await Sport.findByIdAndDelete(newSportObjectID).exec();
      await GroupAggregates.deleteMany({
        group: `Sport:${newSportObjectID}`,
      }).exec();
      expect(await Sport.countDocuments()).toEqual(initialSportsCount);
      expect(await GroupAggregates.countDocuments()).toEqual(
        initialGroupAggregatesCount
      );
    }, 30000);
  });

  describe('2. Test Editing of Sport', () => {
    let initialSportsCount = 0;
    let initialGroupAggregatesCount = 0;
    let GroupAggregatesCountAfterAdding = 0;
    let sportObjectIDsAfterAdding: string[];
    let sportsCountAfterAdding = 0;
    let newSportObjectID: string;
    let newSportSlug: string;
    it('1. Initialize', async () => {
      initialSportsCount = await Sport.countDocuments();
      initialGroupAggregatesCount = await GroupAggregates.countDocuments();
      const {result} = await api.createSport({
        input: {
          name: 'Sport',
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
      newSportObjectID = result.objectID!;
      sportObjectIDsAfterAdding = (await Sport.find().exec()).map(
        (item: any) => item.id
      );
      GroupAggregatesCountAfterAdding = await GroupAggregates.countDocuments();
      sportsCountAfterAdding = await Sport.countDocuments();
      newSportSlug = (await Sport.findById(newSportObjectID).exec())!.slug!;
    }, 30000);
    it('2. Edit Sport', async () => {
      const {result} = await api.editSport({
        id: newSportObjectID,
        input: {
          name: 'Sport - edited',
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
      expect(result.objectType).toEqual('Sport');
      expect(result.success).toBeTruthy();
      expect(sportObjectIDsAfterAdding.includes(result.objectID!)).toBeTruthy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. Sport entry should be retained', async () => {
      const getSport = await Sport.findById(newSportObjectID).exec();
      expect(getSport).not.toBeNull();
    }, 30000);
    it("4. Sport entry's name should be edited", async () => {
      const getSport = await Sport.findById(newSportObjectID).exec();
      expect(getSport?.name).toEqual('Sport - edited');
    }, 30000);
    it("5. Sport entry's slug should be unchanged", async () => {
      const getSport = await Sport.findOne({slug: newSportSlug}).exec();
      expect(getSport).not.toBeNull();
    }, 30000);
    it("6. Sport collection's documents should not increment", async () => {
      const finalSportsCount = await Sport.countDocuments();
      expect(finalSportsCount).toEqual(sportsCountAfterAdding);
    }, 30000);
    it("7. GroupAggregates collection's documents should not increment", async () => {
      const finalGroupAggregatesCount = await GroupAggregates.countDocuments();
      expect(finalGroupAggregatesCount).toEqual(
        GroupAggregatesCountAfterAdding
      );
    }, 30000);
    it('8. GroupAggregates should be retained', async () => {
      const findGroupAggregates = await GroupAggregates.find({
        group: `Sport:${newSportObjectID}`,
      }).exec();
      expect(findGroupAggregates).not.toBeNull();
    }, 30000);
    it('9. Teardown', async () => {
      await Sport.findByIdAndDelete(newSportObjectID).exec();
      await GroupAggregates.deleteMany({
        group: `Sport:${newSportObjectID}`,
      }).exec();
      expect(await Sport.countDocuments()).toEqual(initialSportsCount);
      expect(await GroupAggregates.countDocuments()).toEqual(
        initialGroupAggregatesCount
      );
    }, 30000);
  });

  describe('3. Test Querying of Sport', () => {
    let initialSportObjectIDs: string[];
    let initialSportsCount = 0;
    let initialGroupAggregatesCount = 0;
    let newSportObjectID: string;
    it('1. Initialize', async () => {
      initialSportObjectIDs = (await Sport.find().exec()).map(
        (item: any) => item.id
      );
      initialSportsCount = await Sport.countDocuments();
      initialGroupAggregatesCount = await GroupAggregates.countDocuments();
    }, 30000);
    it('2. Create Sport', async () => {
      const {result} = await api.createSport({
        input: {
          name: 'Sport',
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
      newSportObjectID = result.objectID!;
      expect(result.objectType).toEqual('Sport');
      expect(result.success).toBeTruthy();
      expect(initialSportObjectIDs.includes(result.objectID!)).toBeFalsy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. Sport can be queried by id', async () => {
      const {result} = await api.getSport({
        id: newSportObjectID,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('4. Sport can be queried by slug', async () => {
      const {result} = await api.getSport({
        slug: 'sport',
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('5. Result should be null when neither id nor slug is provided', async () => {
      const {result} = await api.getSport({
        id: null,
        slug: null,
      });
      expect(result).toBeNull();
    }, 30000);
    it('6. All sports can be queried', async () => {
      const {result} = await api.getSports();
      expect(result).not.toBeNull();
      expect(result.total).toEqual(result?.items?.length);
    }, 30000);
    it('7. Teardown', async () => {
      await Sport.findByIdAndDelete(newSportObjectID).exec();
      await GroupAggregates.deleteMany({
        group: `Sport:${newSportObjectID}`,
      }).exec();
      expect(await Sport.countDocuments()).toEqual(initialSportsCount);
      expect(await GroupAggregates.countDocuments()).toEqual(
        initialGroupAggregatesCount
      );
    }, 30000);
  });
};
