import {nonNull, queryField, stringArg} from 'nexus';
import {UserInvites} from 'lib-mongoose';
import {ForbiddenError} from 'apollo-server-express';
import userInviteIDExists from '../../../app/checker/userInviteIDExists';
import gameIDExists from '../../../app/checker/gameIDExists';
import generateRedirectURL from '../../../app/creator/generateRedirectURL';

export const UserInviteQuery = queryField(t => {
  t.field('getUserInvite', {
    type: 'UserInvite',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}) => {
      const result = (await UserInvites.findById(id).exec()) || null;
      if (result) {
        const now = new Date().getTime();
        if (now > result.expiration) {
          throw new ForbiddenError('Link expired. Ask inviter to resend the invitation.');
        }
      }
      return result;
    },
  });
  t.string('generateRedirectUrlWithInviteToken', {
    args: {
      token: nonNull(stringArg()),
    },
    resolve: async (source, {token}) => {
      // Verify if the inputted invite token exists.
      const invite = await userInviteIDExists(token);
      // Verify if the saved game exists.
      const game = await gameIDExists(invite.data.gameID);
      // Generate redirect url
      return generateRedirectURL(game);
    },
  });
});
