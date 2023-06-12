import {arg, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {CMSUser} from 'lib-mongoose';
import cmsUserEmailUniqueness from '../../../app/checker/cmsUserEmailUniqueness';
import stringToSlug from '../../../app/transform/stringToSlug';
import requireLoggedIn from '../../../app/assertion/requireLoggedIn';
import dateIsValid from '../../../app/checker/dateIsValid';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import cmsUserAccessLevelIsValid from '../../../app/checker/cmsUserAccessLevelIsValid';
import cmsUserIsSuperUserOrAdmin from '../../../app/checker/cmsUserIsSuperUserOrAdmin';
import cmsUserEmailExists from '../../../app/checker/cmsUserEmailExists';
import base64ToJson from '../../../app/transform/base64ToJson';

export const birthdateFormat = ['YYYY-MM-DD'];

export const CMSUserMutations = mutationField(t => {
  t.nonNull.field('createCMSUser', {
    type: 'MutationResult',
    args: {
      input: arg({type: nonNull('InputCreateCMSUser')}),
    },
    resolve: async (source, {input}, context) => {
      input.email = input.email.toLowerCase();
      // check inputs
      const invitedBy = context.uid!;
      requireLoggedIn(invitedBy);
      await cmsUserIsSuperUserOrAdmin(invitedBy);
      await cmsUserEmailUniqueness(input.email);
      cmsUserAccessLevelIsValid(input.accessLevel);
      if (input.birthDate) {
        dateIsValid(input.birthDate, birthdateFormat);
      }

      // create firebase account
      const createUser = await global.firebaseCMS
        .auth()
        .createUser({email: input.email!, password: input.password});

      // create CMSUser entry
      input.firstName = input.firstName.trim();
      input.lastName = input.lastName.trim();
      const baseSlug = `${input.firstName} ${input.lastName}`.toLowerCase();
      const slug = await stringToSlug(CMSUser, baseSlug, false, true);
      const result = await CMSUser.create({
        ...input,
        uid: createUser.uid,
        slug,
        invitedBy,
      });

      const firebaseConfig = base64ToJson(global.firebaseConfig);
      // @ts-ignore
      const auth = getAuth(initializeApp(firebaseConfig));
      sendPasswordResetEmail(auth, input.email).catch(error => {
        const errorMessage = error.message;
        console.log('createCMSUser errorMessage', errorMessage);
      });

      return new MutationResult('CMSUser', result.id);
    },
  });
  t.nonNull.field('editCMSUserAccessLevel', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
      accessLevel: nonNull(stringArg()),
    },
    resolve: async (source, {id, accessLevel}, context) => {
      const {uid} = context;
      // check inputs
      requireLoggedIn(uid);
      await cmsUserIsSuperUserOrAdmin(uid!);
      cmsUserAccessLevelIsValid(accessLevel);

      const result = await CMSUser.findByIdAndUpdate(id, {accessLevel}).exec();

      return new MutationResult('CMSUser', result?.id);
    },
  });
  t.nonNull.field('editCMSUserProfile', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
      input: arg({type: nonNull('InputEditCMSUserProfile')}),
    },
    resolve: async (source, {id, input}, context) => {
      const {uid} = context;
      // check inputs
      requireLoggedIn(uid);
      if (input.birthDate) {
        dateIsValid(input.birthDate, birthdateFormat);
      }
      const result = await CMSUser.findByIdAndUpdate(id, {...input}).exec();
      return new MutationResult('CMSUser', result?.id);
    },
  });
  t.nonNull.field('resendInviteCMSUser', {
    type: 'MutationResult',
    args: {
      email: nonNull(stringArg()),
    },
    resolve: async (source, {email}, context) => {
      // check inputs
      const invitedBy = context.uid!;
      requireLoggedIn(invitedBy);
      await cmsUserIsSuperUserOrAdmin(invitedBy);
      const result = await cmsUserEmailExists(email.toLowerCase());

      const firebaseConfig = base64ToJson(global.firebaseConfig);
      // @ts-ignore
      const auth = getAuth(initializeApp(firebaseConfig));
      sendPasswordResetEmail(auth, email).catch(error => {
        const errorMessage = error.message;
        console.log('resendInviteCMSUser errorMessage', errorMessage);
      });
      return new MutationResult('CMSUser', result.id);
    },
  });
  // t.nonNull.field('inviteCMSUser', {
  //   type: 'MutationResult',
  //   args: {
  //     input: arg({type: nonNull(list(nonNull('InputInviteCMSUser')))}),
  //   },
  //   resolve: async (source, {input}, context) => {
  //     for (const user of input) {
  //       await cmsUserEmailUniqueness(user.email);
  //       const invitedBy = context.uid;
  //       requireLoggedIn(invitedBy);
  //       const result = await CMSUser.create({...user, invitedBy});
  //       const data = {
  //         ...user,
  //         id: result.id,
  //         redirectingDomainCMS,
  //       };
  //       await sendTemplatedEmail('inviteCMSUser', ['mari@fx1.io'], {
  //         subject: undefined,
  //         from: undefined,
  //         replyTo: undefined,
  //         data,
  //       });
  //     }
  //     return new MutationResult('CMSUser', null);
  //   },
  // });
  // t.nonNull.field('createCMSUser', {
  //   type: 'MutationResult',
  //   args: {
  //     input: arg({type: nonNull('InputCreateCMSUser')}),
  //     id: nonNull(stringArg()),
  //   },
  //   resolve: async (source, {input, id}) => {
  //     const exists = await CMSUser.findById(id).exec();
  //     if (exists) {
  //       const createUser = await global.firebaseCMS
  //         .auth()
  //         .createUser({email: exists.email!, password: input.password});
  //       input.firstName = input.firstName.trim();
  //       input.lastName = input.lastName.trim();
  //       const baseSlug = `${input.firstName} ${input.lastName}`.toLowerCase();
  //       const slug = await stringToSlug(CMSUser, baseSlug, false, true);
  //       await CMSUser.findByIdAndUpdate(id, {
  //         ...input,
  //         uid: createUser.uid,
  //         slug,
  //       }).exec();
  //     } else {
  //       throw new Error('ID does not exists.');
  //     }
  //     return new MutationResult('CMSUser', id);
  //   },
  // });
});
