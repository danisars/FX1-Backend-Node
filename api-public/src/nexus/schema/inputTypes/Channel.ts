import {inputObjectType} from 'nexus';

export const InputCreateChannel = inputObjectType({
  name: 'InputCreateChannel',
  definition(t) {
    t.nonNull.string('name');
    t.string('description');
    t.nonNull.string('channelGroupID');
    t.nonNull.string('type');
    t.list.nonNull.string('userIDs');
  },
});

export const InputEditChannel = inputObjectType({
  name: 'InputEditChannel',
  definition(t) {
    t.nonNull.string('name');
    t.string('description');
    t.nonNull.string('type');
  },
});
