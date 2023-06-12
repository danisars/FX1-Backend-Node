import track from './track';
import {IAppResolverContext} from '../../../interfaces';

interface inputCreatePrivateRoom {
  sport: string;
  league?: string | null;
  name: string;
  homeTeam: string;
  awayTeam: string;
  ip?: string | null;
  platform: string;
  webDisplaySize?: string | null;
  pageName?: string | null;
  model?: string | null;
  browser?: string | null;
  browserVersion?: string | null;
  os?: string | null;
}

export default async function (event: string, data: inputCreatePrivateRoom, context: IAppResolverContext) {
  const {ip: ipAddress} = context;
  const {
    sport: Sport,
    league: League,
    name: Name,
    homeTeam,
    awayTeam,
    ip,
    platform: Platform,
    webDisplaySize,
    pageName,
    model: Model,
    browser: Browser,
    browserVersion,
    os,
  } = data;
  await track(event, context, {
    Sport,
    League,
    Name,
    'Home Team': homeTeam,
    'Away Team': awayTeam,
    ip: ip || ipAddress,
    Platform,
    'Web Display Size': webDisplaySize,
    'Page Name': pageName,
    Model,
    Browser,
    'Browser version': browserVersion,
    $os: os,
  });
}
