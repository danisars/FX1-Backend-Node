import {AuthenticationError, ExpressContext} from 'apollo-server-express';
import {auth, interfaces} from 'lib-api-common';

export default async function (context: ExpressContext) {
  const {req} = context;

  let uid: string | null | undefined = null;
  let email: string | null | undefined = null;

  // Check Authentication
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const tokenResult = await auth.validateToken(token, global.firebaseCMS);
      uid = tokenResult.uid!;
      email = tokenResult.email!;
    } catch (e) {
      throw new AuthenticationError('Invalid token.');
    }
  }

  const contextObject: interfaces.IAppResolverContext = {
    uid,
    email,
  };
  return contextObject;
}
