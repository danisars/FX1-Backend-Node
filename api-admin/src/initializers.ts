import {connect, disconnect} from 'lib-mongoose';
import './global';
import * as admin from 'firebase-admin';

const {GOOGLE_APPLICATION_CREDENTIALS_CMS: serviceAccountJSONBase64} =
  process.env;

const serviceAccountBuffer = serviceAccountJSONBase64
  ? Buffer.from(serviceAccountJSONBase64, 'base64')
  : null;

global.googleServiceAccountCMS = JSON.parse(serviceAccountBuffer!.toString());
global.firebaseCMS = admin.initializeApp({
  credential: admin.credential.cert(global.googleServiceAccountCMS),
});
global.appEnv = process.env.APP_ENV!.toString();
global.redirectingDomainCMS = process.env.REDIRECTING_DOMAIN_CMS!.toString();
global.sendGridAPIKey = process.env.SENDGRID_API_KEY!;
global.redirectingDomainFX1 = process.env.REDIRECTING_DOMAIN_FX1!;
global.firebaseConfig = process.env.FIREBASE_CONFIG_CMS?.toString();

connect().then(() => {
  console.log('Connected to MongoDB');
});

function terminate() {
  disconnect().then();
}

process.on('SIGTERM', terminate);
process.on('SIGINT', terminate);
