import * as functions from 'firebase-functions';
import * as crypto from 'crypto';
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { CallableContext } from 'firebase-functions/lib/common/providers/https';
import { ActionCodeSettings } from 'firebase-admin/lib/auth/action-code-settings-builder';

interface User {
  uid: string;
  email: string;
  displayName: string;
  disabled: boolean;
  admin: boolean;
}

type UserCommand = Omit<User, 'uid'>;

interface ResetPasswordLinkInfo {
  resetPasswordLink: string;
}

function userRecordToUser(record: UserRecord): User {
  return {
    uid: record.uid,
    email: record.email!,
    displayName: record.customClaims?.displayName ?? record.displayName ?? '',
    disabled: record.disabled,
    admin: !!record.customClaims?.admin
  };
}

const ALPHABET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./<>?;\'":[]\\|}{=-_+`~!@#$%^&*()';

function randomPassword() {
  const length = 16;
  const rb = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHABET[rb[i] % ALPHABET.length];
  }

  return result;
}

function checkAdmin(context: CallableContext) {
  if (!(context.auth?.token?.['admin'] || context.auth?.token.email === 'jnizet@gmail.com')) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'You must be an admin to access this function'
    );
  }
}

export const listUsers = functions.https.onCall(async (_, context): Promise<Array<User>> => {
  checkAdmin(context);
  const auth = getAuth();
  const userRecords = await auth.listUsers();
  return userRecords.users.map(userRecordToUser);
});

export const getUser = functions.https.onCall(async (uid: string, context): Promise<User> => {
  checkAdmin(context);
  const auth = getAuth();
  const userRecord = await auth.getUser(uid);
  return userRecordToUser(userRecord);
});

export const createUser = functions.https.onCall(
  async (command: UserCommand, context): Promise<User> => {
    checkAdmin(context);
    const auth = getAuth();
    const createdUser = await auth.createUser({
      email: command.email,
      displayName: command.displayName,
      emailVerified: true,
      disabled: command.disabled,
      password: randomPassword()
    });
    await auth.setCustomUserClaims(createdUser.uid, {
      admin: command.admin,
      // this is checked by firebase security rules in order to prevent access to any document if the user hasn't been
      // created or updated by these functions, since there is no way to actually prevent signup on Firebase
      user: true,
      // we store the display name in custom claims, because if a user logs in with google,
      // the actual display name of the user becomes the google display name, and we don't want that.
      displayName: command.displayName
    });
    return { ...userRecordToUser(createdUser), admin: command.admin };
  }
);

export const updateUser = functions.https.onCall(async (command: User, context): Promise<void> => {
  checkAdmin(context);
  const auth = getAuth();
  const updatedUser = await auth.updateUser(command.uid, {
    email: command.email,
    displayName: command.displayName,
    emailVerified: true,
    disabled: command.disabled
  });
  await auth.setCustomUserClaims(updatedUser.uid, {
    admin: command.admin,
    // this is checked by firebase security rules in order to prevent access to any document if the user hasn't been
    // created or updated by these functions, since there is no way to actually prevent signup on Firebase
    user: true,
    // we store the display name in custom claims, because if a user logs in with google,
    // the actual display name of the user becomes the google display name, and we don't want that.
    displayName: command.displayName
  });
});

export const generateResetPasswordLink = functions.https.onCall(
  async (uid: string, context): Promise<ResetPasswordLinkInfo> => {
    checkAdmin(context);
    const auth = getAuth();
    const userRecord = await auth.getUser(uid);
    const actionCodeSettings: ActionCodeSettings = {
      url: 'https://maison-solidaire.web.app/reset-password'
    };
    const resetPasswordLink = await auth.generatePasswordResetLink(
      userRecord.email!,
      actionCodeSettings
    );
    return {
      resetPasswordLink
    };
  }
);
