import {objectType, stringArg} from 'nexus';
import getDerivedPhotoURL from '../../../app/getter/getDerivedPhotoURL';

/*
 * There are 2 ways to upload a photo
 * 1. Via channelUploads/
 * 2. Via uploaded/
 */
export function getPhotoURL(
  objectID: string,
  objectType: string,
  isSport?: boolean | null,
  type?: string | null,
  isGameLogo?: boolean | null
) {
  switch (true) {
    case objectType !== 'Photo': {
      return null;
    }
    case isSport: {
      return getDerivedPhotoURL(objectID, true);
    }
    case isGameLogo: {
      return getDerivedPhotoURL(objectID, false, null, true);
    }
    default: {
      return getDerivedPhotoURL(objectID, false, type);
    }
  }
}

export const Media = objectType({
  name: 'Media',
  definition(t) {
    t.nonNull.string('objectID');
    t.nonNull.string('objectType');
    t.boolean('isSport');
    t.boolean('isGameLogo');
    t.string('PhotoURL', {
      args: {
        type: stringArg(),
      },
      resolve: async ({objectID, objectType, isSport}, {type}) => {
        return getPhotoURL(objectID, objectType, isSport, type);
      },
    });
  },
});

export const MediaMessage = objectType({
  name: 'MediaMessage',
  definition(t) {
    t.nonNull.string('objectID');
    t.nonNull.string('objectType');
    t.boolean('isSport', {resolve: () => false});
    t.string('PhotoURL', {
      args: {
        type: stringArg(),
      },
      resolve: async ({objectID, objectType}, {type}) => {
        return getPhotoURL(objectID, objectType, false, type || '1024');
      },
    });
  },
});
