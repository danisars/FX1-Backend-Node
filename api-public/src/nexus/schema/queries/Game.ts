import {Game, GameReminder, GamePartner} from 'lib-mongoose';
import {intArg, nonNull, queryField, stringArg, list} from 'nexus';
import gameIDExists from '../../../app/checker/gameIDExists';
import getZipCodeLinks from '../../../app/getter/getZipCodeLinks';
import {NexusGenRootTypes} from '../../generated/typings';
import {getPhotoURL} from '../objectTypes';

enum GameType {
  LIVE = 'live',
  UPCOMING = 'upcoming',
}
interface IGameArgs {
  next?: string | null;
  count?: number | null;
  type?: string | null;
  leagueCodes?: string | null;
  partnerNames?: string | null;
}

const defaultPageSize = 10;
const leagueCodes: string[] = ['mlb', 'wnba', 'nba', 'ncaab', 'nhl', 'concacaf', 'efl', 'uefa', 'mls', 'epl'];
const gameArgs = {
  next: stringArg(),
  type: nonNull(stringArg()),
  count: intArg(),
  leagueCodes: stringArg(),
  partnerNames: stringArg(),
};

const makeFindQuery = (leagueCodes?: string[] | null, type?: string | null, partnerNames?: string[] | null) => {
  let query: any = {};

  if (type) {
    if (type === GameType.LIVE) {
      query = {
        $and: [
          {timeLeft: {$nin: [null, '', /^Final/]}},
          {$and: [{date: {$gte: new Date().getTime() - 12 * 60 * 60 * 1000}}, {date: {$lte: new Date().getTime()}}]},
        ],
      };
    }
    if (type === GameType.UPCOMING) {
      query = {$or: [{timeLeft: null}, {timeLeft: ''}], date: {$gt: new Date().getTime()}};
    }
  }
  query = leagueCodes ? {...query, leagueCode: {$in: leagueCodes}} : query;
  query = partnerNames ? {...query, 'links.source': {$in: partnerNames}} : query;

  return query;
};
const makePaginationQuery = async (next?: string | null, type?: string | null) => {
  if (!next) return {};
  const game = await Game.findById(next);
  if (!game) return {};

  if (type === GameType.LIVE) {
    return {
      $or: [
        {points: {$lt: game.points}},
        {
          points: game.points,
          _id: {$gt: game._id},
        },
      ],
    };
  }
  return {
    $or: [
      {date: {$gt: game.date}},
      {
        date: game.date,
        _id: {$gt: game._id},
      },
    ],
  };
};
const makeSortQuery = (type?: string | null) => {
  const query: any = {};
  if (type === GameType.LIVE) {
    query.points = -1;
  } else {
    query.date = 1;
  }
  // if (type === GameType.UPCOMING) {
  //   query.date = 1;
  // } else {
  //   query.points = -1;
  // }
  return query;
};
const getGames = async (args: IGameArgs, uid?: string | null) => {
  const paginationQuery = await makePaginationQuery(args.next, args.type);
  const sortQuery = makeSortQuery(args.type);
  let leagues: string[] | undefined = args.leagueCodes?.split(',');
  let partners: string[] | undefined = args.partnerNames?.split(',');
  partners = partners?.map(partner => partner.toUpperCase());

  if (!leagues) leagues = leagueCodes;
  const findQuery = makeFindQuery(leagues, args.type, partners);
  args.count = args.count ? args.count : defaultPageSize;
  let games = await Game.find(findQuery).sort(sortQuery).find(paginationQuery).limit(args.count);

  // Check if there is any games today
  const todayGames = games.filter(game => {
    const today = new Date().setHours(0, 0, 0, 0);
    const thatDay = new Date(game.date).setHours(0, 0, 0, 0);

    if (today === thatDay) {
      return true;
    }
    return false;
  });
  // Only if there are any games today, filter by zipcode
  if (todayGames.length > 0 && uid) {
    console.log('Getting zip code links');
    games = await getZipCodeLinks(uid, games);
  }

  const reminders = await GameReminder.find({uid});
  const results: NexusGenRootTypes['Game'][] = games.map(game => {
    const reminder = reminders.find(ele => ele.gameID === game.gameID.toString());
    return {
      ...game.toObject(),
      isReminded: reminder ? true : false,
    };
  });

  const gamePartners = await GamePartner.find({});
  const partnerIcons: {[key: string]: string | null} = {};
  const partnerLogos: {[key: string]: string | null} = {};
  for (const {Icon, Logo, name} of gamePartners) {
    if (Icon) {
      const {objectID, objectType, isSport} = Icon;
      partnerIcons[name] = getPhotoURL(objectID, objectType, isSport);
    }
    if (Logo) {
      const {objectID, objectType, isSport} = Logo;
      partnerLogos[name] = getPhotoURL(objectID, objectType, isSport);
    }
  }

  results.forEach(game => {
    game.links?.forEach(link => {
      if (link && link?.source) {
        link.iconUrl = partnerIcons[link?.source];
        link.logoUrl = partnerLogos[link?.source];
      }
    });
  });

  return {
    count: results.length,
    next: results.length > 0 ? games[games.length - 1]?._id?.toString() : null,
    items: results,
  };
};

export const GameQuery = queryField(t => {
  t.field('getGame', {
    type: 'Game',
    args: {
      gameID: nonNull(intArg()),
    },
    resolve: async (source, {gameID}, {uid}) => {
      // Check if the game exists.
      let game = await gameIDExists(gameID.toString());

      if (uid) {
        game = await getZipCodeLinks(uid, game);
      }

      const reminder = await GameReminder.findOne({uid, gameID});
      const game1: NexusGenRootTypes['Game'] = {
        ...game.toObject(),
        isReminded: reminder ? true : false,
      };

      const gamePartners = await GamePartner.find({});
      const partnerIcons: {[key: string]: string | null} = {};
      const partnerLogos: {[key: string]: string | null} = {};
      for (const {Icon, Logo, name} of gamePartners) {
        if (Icon) {
          const {objectID, objectType, isSport} = Icon;
          partnerIcons[name] = getPhotoURL(objectID, objectType, isSport);
        }
        if (Logo) {
          const {objectID, objectType, isSport} = Logo;
          partnerLogos[name] = getPhotoURL(objectID, objectType, isSport);
        }
      }

      game1.links?.forEach(link => {
        if (link && link?.source) {
          link.iconUrl = partnerIcons[link?.source];
          link.logoUrl = partnerLogos[link?.source];
        }
      });
      return game1;
    },
  });
  t.nonNull.field('getGames', {
    type: 'Games',
    args: gameArgs,
    resolve: async (source, args: IGameArgs, {uid}) => {
      return await getGames(args, uid);
    },
  });
  t.nonNull.list.field('getUpcomingGames', {
    type: 'UpcomingGamesByLeagueCode',
    args: {
      leagueCodes: nonNull(list(nonNull(stringArg()))),
    },
    resolve: async (source, {leagueCodes: plgCodes}, {uid}) => {
      const leagueGames = [];
      const lgCodes = plgCodes.length > 0 ? plgCodes : leagueCodes;
      for (const leagueCode of lgCodes) {
        const games = await getGames({type: 'upcoming', leagueCodes: leagueCode}, uid);
        leagueGames.push({
          leagueCode,
          Games: games.items,
        });
      }
      return leagueGames;
    },
  });
  t.field('getFeaturedGame', {
    type: 'Game',
    resolve: async () => {
      let featuredGame = (await getGames({type: 'live', count: 1})).items[0];
      if (!featuredGame) {
        featuredGame = (await getGames({type: 'upcoming', count: 1})).items[0];
      }
      return featuredGame;
    },
  });
});
