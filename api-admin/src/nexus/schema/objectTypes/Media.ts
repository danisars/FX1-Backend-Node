import {objectType} from 'nexus';
import getDerivedPhotoURL from '../../../app/getter/getDerivedPhotoURL';

export const Media = objectType({
  name: 'Media',
  definition(t) {
    t.nonNull.string('objectID');
    t.nonNull.string('objectType');
    t.boolean('isSport');
    t.string('PhotoURL', {
      resolve: async ({objectType, objectID, isSport}) => {
        if (objectType !== 'Photo') return null;
        if (isSport) {
          return getDerivedPhotoURL(objectID, true);
        }
        return getDerivedPhotoURL(objectID);
      },
    });
  },
});
