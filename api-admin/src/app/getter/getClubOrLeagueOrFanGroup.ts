import {Club, FanGroup, League} from 'lib-mongoose';
import {Model} from 'mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (
  objectType: string,
  objectID: string,
  projection: any
) {
  const model: typeof Model =
    objectType === 'Club' ? Club : objectType === 'League' ? League : FanGroup;
  const result = await model.findById(objectID, projection).exec();
  if (!result) {
    throw new UserInputError(`${objectType} not found.`);
  }
  return result;
}
