import createChannelGroup from './createChannelGroup';
import createChannel from './createChannel';

export default async function (lockerRoomID: string, group: string) {
  // Create default channel group
  const channelGroupData = {
    name: 'Information',
    description: 'Default channel group for locker room.',
    lockerRoomID,
  };
  const channelGroupResult = await createChannelGroup(channelGroupData, group);

  // Create default channels
  const channelGeneralData = {
    name: 'General',
    description: 'Default channel.',
    channelGroupID: channelGroupResult.id!,
    type: 'Public',
  };
  const channelAnnouncementsData = {
    name: 'Announcements',
    description: 'Default channel.',
    channelGroupID: channelGroupResult.id!,
    type: 'Public',
  };
  const channelInjuriesData = {
    name: 'Injuries',
    description: 'Default channel.',
    channelGroupID: channelGroupResult.id!,
    type: 'Public',
  };
  const channelInquiriesData = {
    name: 'Inquiries',
    description: 'Default channel.',
    channelGroupID: channelGroupResult.id!,
    type: 'Public',
  };
  await createChannel(channelGeneralData!, lockerRoomID!);
  switch (true) {
    case group.startsWith('Club') || group.startsWith('League'): {
      await createChannel(channelAnnouncementsData!, lockerRoomID!);
      await createChannel(channelInjuriesData!, lockerRoomID!);
      break;
    }
    case group.startsWith('FanGroup'): {
      break;
    }
    case group.startsWith('InHouse'): {
      await createChannel(channelAnnouncementsData!, lockerRoomID!);
      await createChannel(channelInquiriesData!, lockerRoomID!);
      break;
    }
    default: {
      break;
    }
  }
}
