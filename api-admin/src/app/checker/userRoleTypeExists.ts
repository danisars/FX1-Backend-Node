import {UserRoleType, UserRoleTypeDocument} from 'lib-mongoose';

export default async function (id: string) {
  const ids = (await UserRoleType.find().exec()).map(
    (item: UserRoleTypeDocument) => item.id
  );
  if (!ids.includes(id)) {
    throw new Error(`UserRoleType does not exist. Input: ${id}.`);
  }
}
