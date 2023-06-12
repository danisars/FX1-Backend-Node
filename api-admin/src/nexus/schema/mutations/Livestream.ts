import {arg, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {ChannelGroup, Livestream, LivestreamSource} from 'lib-mongoose';
import {dateFormat} from '../../../utilities';
import lockerRoomIDExists from '../../../app/checker/lockerRoomIDExists';
import createChannelGroup from '../../../app/creator/createChannelGroup';
import createChannel from '../../../app/creator/createChannel';
import livestreamSourceExists from '../../../app/checker/livestreamSourceExists';
import dateIsValid from '../../../app/checker/dateIsValid';
import urlIsValid from '../../../app/checker/urlIsValid';

export const LivestreamMutations = mutationField(t => {
  t.nonNull.field('addLivestream', {
    type: 'MutationResult',
    args: {
      channelName: nonNull(stringArg()),
      lockerRoomID: nonNull(stringArg()),
      input: arg({type: nonNull('InputLivestream')}),
    },
    resolve: async (source, {channelName, lockerRoomID, input}) => {
      // Check if locker room ID exists.
      const {group, name: lockerRoomName} = await lockerRoomIDExists(
        lockerRoomID
      );
      // Check if source is available.
      await livestreamSourceExists(input.source);
      // Check if link is valid.
      await urlIsValid(input.link);
      // Check if startDate is in correct format.
      if (input.startDate) {
        await dateIsValid(input.startDate, dateFormat);
      }
      // Create livestream
      const livestreamResult = await Livestream.create({...input});
      if (livestreamResult) {
        // Check if Channel Group for Livestream exists
        const livestreamingChannelGroupExists = await ChannelGroup.findOne({
          lockerRoomID,
          withLivestream: true,
        }).exec();
        let channelGroupID;
        // If does not exists, create new channel group
        if (!livestreamingChannelGroupExists) {
          const channelGroupData = {
            name: `${lockerRoomName} LIVE`,
            description:
              'Default channel group for locker room with Livestreams.',
            lockerRoomID,
            withLivestream: true,
          };
          channelGroupID = (await createChannelGroup(channelGroupData, group))
            .id;
        } else {
          channelGroupID = livestreamingChannelGroupExists.id;
        }
        // Create channel
        const channelData = {
          name: channelName,
          description: `Channel for livestreaming - ${input.title}.`,
          channelGroupID: channelGroupID,
          type: 'Public',
          livestreamID: livestreamResult.id,
        };
        await createChannel(channelData!, lockerRoomID!);
      }
      return new MutationResult('Livestream', livestreamResult?.id);
    },
  });
  t.nonNull.field('addLivestreamSource', {
    type: 'MutationResult',
    args: {
      name: nonNull(stringArg()),
    },
    resolve: async (source, {name}) => {
      const result = await LivestreamSource.findByIdAndUpdate(
        name,
        {id: name, name},
        {upsert: true, new: true}
      ).exec();
      return new MutationResult('LivestreamSource', result?.id);
    },
  });
  t.nonNull.field('setLivestreamLive', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}) => {
      const result = await Livestream.findByIdAndUpdate(id, {
        isLive: true,
        updatedAt: new Date().getTime(),
      }).exec();
      return new MutationResult('Livestream', result?.id);
    },
  });
});
