import * as admin from 'firebase-admin';
import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
export {};

declare global {
  // eslint-disable-next-line no-var
  var appEnv: string;
  // eslint-disable-next-line no-var
  var firebaseCMS: admin.app.App;
  // eslint-disable-next-line no-var
  var googleServiceAccountCMS: any;
  // eslint-disable-next-line no-var
  var mailer: Transporter<SMTPTransport.SentMessageInfo>;
  // eslint-disable-next-line no-var
  var redirectingDomainCMS: string;
  // eslint-disable-next-line no-var
  var sendGridAPIKey: string;
  // eslint-disable-next-line no-var
  var redirectingDomainFX1: string;
  // eslint-disable-next-line no-var
  var firebaseConfig: any;
}
