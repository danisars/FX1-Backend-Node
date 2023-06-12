import {GroupAggregates, LockerRoom} from 'lib-mongoose';

export default async function (group: string) {
  const lockerRoomResult = await LockerRoom.findOneAndDelete({
    group,
  }).exec();
  await GroupAggregates.findOneAndDelete({
    group: `LockerRoom:${lockerRoomResult?.id}`,
  }).exec();
  return lockerRoomResult;
}
