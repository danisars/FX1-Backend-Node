import axios from 'axios';
import {AuthenticationError} from 'apollo-server-express';

const requestUrl = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_API_KEY}`;

const getAndroidPackageName = (): string => {
  const packageName = 'io.fx1.sports';
  switch (process.env.APP_ENV) {
    case 'develop':
      return `${packageName}.dev`;
    case 'staging':
      return `${packageName}.staging`;
    case 'production':
      return packageName;
    default:
      return packageName;
  }
};

const getPrefixDomain = (): string => {
  let prefixDomain = '';
  switch (process.env.APP_ENV) {
    case 'develop':
      prefixDomain = 'dev';
      break;
    case 'staging':
      prefixDomain = 'staging';
      break;
    case 'production':
      prefixDomain = 'prod';
      break;
    default:
      break;
  }
  return `https://${prefixDomain}fx1.page.link`;
};

export const createDynamicUrl = async (link: string): Promise<string> => {
  try {
    return await (
      await axios.post(
        requestUrl,
        {
          dynamicLinkInfo: {
            link,
            domainUriPrefix: getPrefixDomain(),
            androidInfo: {
              androidPackageName: getAndroidPackageName(),
              androidMinPackageVersionCode: '20230522',
            },
            iosInfo: {
              iosBundleId: 'io.fx1.fx1',
              iosAppStoreId: '1626034650',
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    ).data?.shortLink;
  } catch (e) {
    throw new AuthenticationError('Cannot create dynamic link.');
  }
};
