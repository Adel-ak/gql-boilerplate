import { ForbiddenError } from 'apollo-server-core';
import admin, { ServiceAccount } from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';
import { Injectable, Provider, Scope } from 'graphql-modules';
import serviceAccount from '../../credentials/firebase-sdk-private-key.json' assert { type: 'json' };
import { GoResponse } from '../../shared/types/index.js';

export type FbApp = admin.app.App;

const fbCert = serviceAccount as ServiceAccount;

@Injectable({ global: true, scope: Scope.Singleton })
export class FirebaseService {
  constructor() {
    this.#mainApp = admin.initializeApp({
      credential: admin.credential.cert(fbCert),
    });

    this.auth = this.#mainApp.auth;
  }

  #mainApp: FbApp;
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
}

export const FirebaseProvider: Provider = {
  provide: FirebaseService,
  useClass: FirebaseService,
};
