import {objectType} from 'nexus';
import stringToObjectId from '../../../app/transform/stringToObjectId';
import {Sport, League, LockerRoom} from 'lib-mongoose';

export const Club = objectType({
  name: 'Club',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.list.nonNull.string('sportIDs');
    t.field('Avatar', {type: 'Media'});
    t.field('CoverPhoto', {type: 'Media'});
    t.string('leagueID');
    t.boolean('isFeatured');

    // dynamic
    t.list.nonNull.field('Sports', {
      type: 'Sport',
      resolve: async ({sportIDs}) => {
        const _id = sportIDs.map((id: string) => stringToObjectId(id));
        return await Sport.find({_id: {$in: _id}}).exec();
      },
    });
    t.field('League', {
      type: 'League',
      resolve: async ({leagueID}) => {
        return await League.findById(leagueID).exec();
      },
    });
    t.field('LockerRoom', {
      type: 'LockerRoom',
      resolve: async ({id}) => {
        return await LockerRoom.findOne({group: `Club:${id}`}).exec();
      },
    });
  },
});
