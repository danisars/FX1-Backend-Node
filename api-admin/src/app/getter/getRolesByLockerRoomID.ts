import {UserRole, UserRoleDocument} from 'lib-mongoose';

export default async function (lockerRoomID: string) {
  const result = await UserRole.find({
    $and: [
      {lockerRoomID},
      {
        $or: [
          {groupType: 'Club'},
          {groupType: 'League'},
          {groupType: 'FanGroup'},
        ],
      },
    ],
  }).exec();
  return {
    Owners: await getRolesByLockerRoomID(lockerRoomID, result, 'owner'),
    Managers: await getRolesByLockerRoomID(lockerRoomID, result, 'manager'),
    Supporters: await getRolesByLockerRoomID(lockerRoomID, result, 'supporter'),
  };
}

async function getRolesByLockerRoomID(
  lockerRoomID: string,
  result: UserRoleDocument[],
  type: string
) {
  return result.filter(item => item.role === type);
  // if (type === 'supporter') {
  //   // Return users that are neither owners nor managers but supporters
  //   // Check uid of result, remove all that are not unique. Context: 2 User Roles are given to owner/manager. 1 as it is and 1 as supporter
  //   // Desired outcome: Supporters only with no other roles.
  //   const uids = result.flatMap((item, n, result) => {
  //     const role = item.role;
  //     const uid = item.uid;
  //     const length = result.filter(item => item.uid === uid).length;
  //     return length === 1 && role === 'supporter' ? uid : [];
  //   });
  //   return await UserRole.find({
  //     $and: [
  //       {lockerRoomID},
  //       {
  //         $or: [
  //           {groupType: 'Club'},
  //           {groupType: 'League'},
  //           {groupType: 'FanGroup'},
  //         ],
  //       },
  //       {
  //         uid: {
  //           $in: uids,
  //         },
  //       },
  //       {role: type},
  //     ],
  //   }).exec();
  // } else {
  // return await UserRole.find({
  //   $and: [
  //     {lockerRoomID},
  //     {
  //       $or: [
  //         {groupType: 'Club'},
  //         {groupType: 'League'},
  //         {groupType: 'FanGroup'},
  //       ],
  //     },
  //     {role: type},
  //   ],
  // }).exec();
  // }
}

// export default async function (lockerRoomID: string) {
//   const result = (
//     await UserRole.find({
//       $and: [{lockerRoomID}, {$or: [{groupType: 'Club'}, {groupType: 'League'}]}],
//     }).exec()
//   ).map((item: UserRoleDocument) => {
//     return {role: item.role, uid: item.uid};
//   });
//   return {
//     Owners: await getRolesByLockerRoomID(result, 'owner'),
//     Managers: await getRolesByLockerRoomID(result, 'manager'),
//     Supporters: await getRolesByLockerRoomID(result, 'supporter'),
//   };
// }
//
// async function getRolesByLockerRoomID(result: {role?: string; uid: string}[], type: string) {
//   if (type === 'supporter') {
//     // Return users that are neither owners nor managers.
//     // Check uid of result, remove all that are not unique
//     // Then remove role
//     const uids = result.flatMap((item, n, result) => {
//       const role = item.role;
//       const uid = item.uid;
//       const length = result.filter(item => item.uid === uid).length;
//       return length === 1 && role === 'supporter' ? uid : [];
//     });
//     return await User.find({
//       uid: {
//         $in: uids,
//       },
//     });
//   }
//   return await User.find({
//     uid: {
//       $in: result.filter(item => item.role === type).map((item: any) => item.uid),
//     },
//   });
// }
