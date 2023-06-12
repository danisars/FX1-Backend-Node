import {objectType, list} from 'nexus';
import getDerivedPhotoURL from '../../../app/getter/getDerivedPhotoURL';

const leagues = ['mlb', 'wnba', 'nba', 'ncaa', 'nhl', 'concacaf', 'efl', 'uefa', 'mls', 'epl'];

export const Game = objectType({
  name: 'Game',
  definition(t) {
    t.nonNull.string('sport');
    t.nonNull.int('gameID');
    t.nonNull.float('date');
    t.nonNull.int('points');
    t.int('team1ID');
    t.string('team1City');
    t.string('team1Name');
    t.int('team1Ranking');
    t.int('team1Score');
    t.string('team1Color');
    t.string('team1Logo', {
      resolve: ({team1ID}) => {
        return getDerivedPhotoURL(team1ID!.toString(), false, null, true);
      },
    });
    t.int('team2ID');
    t.string('team2City');
    t.string('team2Name');
    t.int('team2Ranking');
    t.int('team2Score');
    t.string('team2Color');
    t.string('team2Logo', {
      resolve: ({team2ID}) => {
        return getDerivedPhotoURL(team2ID!.toString(), false, null, true);
      },
    });
    t.string('location');
    t.string('headline');
    t.field('links', {type: list('Link')});
    t.string('timeLeft');
    t.string('competition');
    t.string('coverImage');
    t.string('pointsLevel');
    t.string('excitementLevel', {
      resolve: ({pointsLevel}) => {
        switch (pointsLevel) {
          case 'Guarded':
            return 'OK';
          case 'Elevated':
            return 'GOOD';
          case 'High':
            return 'HOT';
          case 'Severe':
            return 'EPIC';
          default:
            return 'OK';
        }
      },
    });
    t.int('highPoints');
    t.string('leagueCode');
    t.nonNull.boolean('isReminded');
    t.string('team1Nickname');
    t.string('team2Nickname');
    t.string('team1DisplayName');
    t.string('team2DisplayName');

    //dynamic
    t.nonNull.string('group', {
      resolve: async ({gameID}) => {
        return `Game:${gameID}`;
      },
    });

    //dynamic isLive
    t.nonNull.boolean('isLive', {
      resolve: async ({timeLeft, date}) => {
        return !!(timeLeft && !timeLeft?.includes('Final') && date <= new Date().getTime());
      },
    });
  },
});

export const UpcomingGamesByLeagueCode = objectType({
  name: 'UpcomingGamesByLeagueCode',
  definition(t) {
    t.nonNull.string('leagueCode');
    t.nonNull.list.field('Games', {type: 'Game'});
  },
});

export const GameByLeague = objectType({
  name: 'GameByLeague',
  definition(t) {
    leagues.forEach(league => {
      t.field(league, {type: 'Games'});
    });
  },
});
