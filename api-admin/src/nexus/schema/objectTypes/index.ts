import {objectType} from 'nexus';
import {NexusGenObjects} from '../../generated/typings';

function createPagedItems(name: string, type: keyof NexusGenObjects) {
  return objectType({
    name,
    definition(t) {
      t.list.nonNull.field('items', {type});
      t.int('count');
      t.string('next');
      t.int('total');
    },
  });
}

// Paged objects
export const Users = createPagedItems('Users', 'User');
export const Leagues = createPagedItems('Leagues', 'League');
export const Sports = createPagedItems('Sports', 'Sport');
export const Clubs = createPagedItems('Clubs', 'Club');
export const ChannelGroups = createPagedItems('ChannelGroups', 'ChannelGroup');
export const Channels = createPagedItems('Channels', 'Channel');
export const CMSUsers = createPagedItems('CMSUsers', 'CMSUser');
export const LockerRooms = createPagedItems('LockerRooms', 'LockerRoom');
export const FanGroups = createPagedItems('FanGroups', 'FanGroup');
export const InHouses = createPagedItems('InHouses', 'InHouse');
export const GamePartners = createPagedItems('GamePartners', 'GamePartner');

// Standalone objects
export * from './User';
export * from './League';
export * from './Club';
export * from './Sport';
export * from './MutationResult';
export * from './ChannelGroup';
export * from './Channel';
export * from './CMSUser';
export * from './Media';
export * from './LockerRoom';
export * from './UserRole';
export * from './FanGroup';
export * from './Livestream';
export * from './LivestreamSource';
export * from './InHouse';
export * from './ZipCode';
export * from './GamePartner';
