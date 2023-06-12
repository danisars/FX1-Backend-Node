import {Sport} from 'lib-mongoose';

export default async function (ids: string[]) {
  for (const id of ids) {
    const exists = await Sport.findById(id).exec();
    if (!exists) {
      throw new Error(`Sport ID does not exist. Input: ${id}.`);
    }
  }
}
