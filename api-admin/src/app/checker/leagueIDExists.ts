import {League} from 'lib-mongoose';

export default async function (id: string) {
  const exists = await League.findById(id).exec();
  if (!exists) {
    throw new Error(`League ID does not exist. Input: ${id}.`);
  }
}
