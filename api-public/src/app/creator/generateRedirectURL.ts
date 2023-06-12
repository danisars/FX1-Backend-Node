import {GameDocument} from 'lib-mongoose';

export default function (game: GameDocument) {
  const {gameID, sport, leagueCode, team1DisplayName, team2DisplayName} = game;
  const sportUrl = sport.toLowerCase().replace(/ /g, '-');
  const team1 = team1DisplayName.toLowerCase().replace(/ /g, '-');
  const team2 = team2DisplayName.toLowerCase().replace(/ /g, '-');
  const redirectUrl = `${process.env.BASE_URL}/${sportUrl}/${leagueCode}/${team1}-vs-${team2}/${gameID}?privateShow=true`;
  return redirectUrl;
}
