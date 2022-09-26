import { ForbiddenError } from 'apollo-server-core';
import admin, { ServiceAccount } from 'firebase-admin';
import { DecodedIdToken, UserRecord } from 'firebase-admin/auth';
import { Injectable, Provider, Scope } from 'graphql-modules';
import serviceAccount from '../../credentials/firebase-sdk-private-key.json' assert { type: 'json' };
import { ERoles, GQL_FieldError, GQL_FieldsError, GQL_MutateUserInput } from '../../generated-types/graphql.js';
import { FireBaseAuthErrorCode } from '../../shared/types/firebase.js';
import { GoResponse, ReqError } from '../../shared/types/index.js';

export type FbApp = admin.app.App;

const fbCert = serviceAccount as ServiceAccount;

@Injectable({ global: true, scope: Scope.Singleton })
export class FirebaseService {
  constructor() {
    this.mainApp = admin.initializeApp({
      credential: admin.credential.cert(fbCert),
    });

    this.auth = this.mainApp.auth;
  }

  private mainApp: FbApp;
  auth: typeof admin.auth;

  validToken = async (token?: string): Promise<GoResponse<DecodedIdToken, ForbiddenError>> => {
    const error = new ForbiddenError('You shall not pass!');

    try {
      if (token && token.startsWith('Bearer ')) {
        const authToken = token.split(' ')[1];
        const decoded = await this.auth().verifyIdToken(authToken);

        return [decoded, null];
      }
      return [null, error];
    } catch (err: any) {
      if (err.code === 'auth/argument-error') {
        error.message = 'Invalid Auth Token.';
      }

      if (err.code === 'auth/id-token-expired') {
        error.message = 'ID token has expired.';
      }
      return [null, error];
    }
  };

  createFirebaseUser = async (
    input: GQL_MutateUserInput,
    uid?: string,
  ): GoResponse<UserRecord, ReqError | GQL_FieldsError> => {
    try {
      const { email, name: displayName, password } = input;

      const user = await this.auth().createUser({
        uid,
        email: email.trim(),
        displayName,
        password: password.trim(),
      });
      return [user, null];
    } catch (err: any) {
      const fieldsError: GQL_FieldError[] = [];

      const { EMAIL_ALREADY_EXISTS, INVALID_PASSWORD } = FireBaseAuthErrorCode;

      switch (err.code) {
        case EMAIL_ALREADY_EXISTS:
          fieldsError.push({
            field: 'email',
            message: 'The email address is already in use by another account.',
          });
          break;
        case INVALID_PASSWORD:
          fieldsError.push({
            field: 'password',
            message: 'The password must be at least 6 characters long.',
          });
          break;
      }

      if (fieldsError.length > 0) {
        const inputErrors: GQL_FieldsError = {
          fields: fieldsError,
          message: '',
          __typename: 'FieldsError',
        };
        return [null, inputErrors];
      }

      return [null, new ReqError({})];
    }
  };

  setClaims = async (uid: string, role: ERoles, permissions: string[]) => {
    try {
      await this.auth().setCustomUserClaims(uid, {
        role,
        permissions,
      });
    } catch (err) {}
  };
}

export const FirebaseProvider: Provider = {
  provide: FirebaseService,
  useClass: FirebaseService,
};
