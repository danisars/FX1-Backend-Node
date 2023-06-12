import {GameDocument, UserDocument} from 'lib-mongoose';
import generateRedirectURL from '../../creator/generateRedirectURL';
import sendTemplatedEmail, {defaultSender} from '../sendTemplatedEmail';

export default function (user: UserDocument, ownerUser: UserDocument, game: GameDocument) {
  sendTemplatedEmail('privateRoomInvite', {
    subject: 'You are invited to a private group on FX1!',
    recipients: [user.emailAddress],
    sender: defaultSender,
    data: {
      username: user.username,
      'private-room-owner': ownerUser.username,
      team1: game.team1DisplayName,
      team2: game.team2DisplayName,
      'invite-link': generateRedirectURL(game),
    },
  });
}
