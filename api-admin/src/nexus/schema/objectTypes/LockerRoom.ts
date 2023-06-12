import {objectType} from 'nexus';
import getRolesByLockerRoomID from '../../../app/getter/getRolesByLockerRoomID';

export const LockerRoom = objectType({
  name: 'LockerRoom',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.string('group');
    t.field('Roles', {
      type: 'UserRolesInLockerRoom',
      resolve: async ({id: lockerRoomID}) => {
        return await getRolesByLockerRoomID(lockerRoomID!);
      },
    });
  },
});

export const UserRolesInLockerRoom = objectType({
  name: 'UserRolesInLockerRoom',
  definition(t) {
    // dynamic
    t.nonNull.list.nonNull.field('Owners', {type: 'UserRole'});
    t.nonNull.list.nonNull.field('Managers', {type: 'UserRole'});
    t.nonNull.list.nonNull.field('Supporters', {type: 'UserRole'});
  },
});
