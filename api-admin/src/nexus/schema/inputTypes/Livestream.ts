import {inputObjectType} from 'nexus';

export const InputLivestream = inputObjectType({
  name: 'InputLivestream',
  definition(t) {
    t.nonNull.string('title');
    t.nonNull.string('link');
    t.nonNull.string('source');
    t.string('startDate');
    t.string('timezone');
  },
});
