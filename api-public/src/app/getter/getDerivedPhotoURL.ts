import getEnv from './getEnv';

export default function (id: string, isSport = false, type?: string | null, isGameLogo = false) {
  let url = 'photos/0';
  const env = getEnv();
  if (isSport) {
    url = 'photos/sports';
  }
  if (isGameLogo) {
    return `https://${env}.io/photos/game/team/logo/${id}.png`;
  }
  // return `https://us-central1-${env}.cloudfunctions.net/photos/${id}.webp`;
  return `https://${env}.io/${url}/${id}${type ? `-${type}` : ''}.webp`;
}
