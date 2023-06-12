import {CMSUser} from 'lib-mongoose';

export default async function (email: string) {
  const exists = await CMSUser.findOne({email}).exec();
  if (exists) {
    // throw new Error(`Email already exist. Input: ${email}.`);
    throw new Error(`Hmmm, that email already exists. Input: ${email}.`);
  }
}
