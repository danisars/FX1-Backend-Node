import {readFileSync} from 'fs';
import {resolve} from 'path';
import handlebars from 'handlebars';
import {Logs} from 'lib-mongoose';
const sgMail = require('@sendgrid/mail');

export type SendTemplatedEmailProps = {
  subject?: string;
  data?: object;
};

const templateIDs = {
  inviteUserWithManagerialRoleWithLink: 'd-d7962587c5734b28820aaa554e0fbb00',
  inviteUserWithManagerialRoleWithoutLink: 'd-4309d4e4dab443b7a7bb44c0cfb8051b',
};

export const defaultSender = 'FX1 <hello@fx1.io>';
export const defaultSenderEmail = 'hello@fx1.io';

export default async function (
  type: string,
  recipients: string[],
  {subject, data}: SendTemplatedEmailProps
) {
  const emailTemplateSource = readFileSync(
    resolve(__dirname, `../email/templates/${type}.hbs`),
    'utf8'
  );
  const template = handlebars.compile(emailTemplateSource);
  const html = template(data);

  let msg;
  sgMail.setApiKey(global.sendGridAPIKey);
  if (
    type !== 'inviteUserWithManagerialRoleWithLink' &&
    type !== 'inviteUserWithManagerialRoleWithoutLink'
  ) {
    msg = {
      to: recipients,
      from: defaultSender,
      subject,
      html,
    };
  } else {
    msg = {
      to: recipients,
      from: defaultSender,
      subject,
      templateId: templateIDs[type],
      dynamicTemplateData: data,
    };
  }

  let logs;
  sgMail
    .send(msg)
    .then(async (result: any) => {
      console.log(`Email sent ${type}`);
      logs = {
        responseCode: result[0].statusCode,
        responseMessage: '',
        requestHeader: result[0].headers,
        status: 'successful',
        sender: defaultSenderEmail,
        recipient: recipients,
      };
    })
    .catch(async (error: any) => {
      console.error('Email error:', error);
      logs = {
        responseCode: error.code,
        responseMessage: error.message,
        requestHeader: error.response.headers,
        status: 'failed',
        sender: defaultSenderEmail,
        recipient: recipients,
      };
    });
  await Logs.create({
    type,
    logs,
  });
}
