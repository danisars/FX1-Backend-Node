import {Game} from 'lib-mongoose';

export default async function () {
  const findQuery = {
    $and: [
      {timeLeft: {$nin: [null, '', /^Final/]}},
      {$and: [{date: {$gte: new Date().getTime() - 12 * 60 * 60 * 1000}}, {date: {$lte: new Date().getTime()}}]},
    ],
  };

  const games = await Game.find(findQuery);
  return games;
}
