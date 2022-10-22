import escapeStringRegexp from 'escape-string-regexp';
import { Injectable, Scope } from 'graphql-modules';
import { ClientModel, IClient } from '../../db/model/client.model.js';
import { GQL_FilterClientsInput } from '../../generated-types/graphql.js';

@Injectable({
  global: false,
  scope: Scope.Singleton,
})
export class ClientService {
  filterClients = async (input: GQL_FilterClientsInput): Promise<IClient[]> => {
    const filter: Record<string, any> = {};
    if (input.search) {
      const regex = new RegExp(`${escapeStringRegexp(input.search)}`, 'gi');

      filter.$or = [{ name: { $regex: regex } }, { cid: { $regex: regex } }, { phone: { $regex: regex } }];
    }

    const clients = await ClientModel.find(filter).limit(50).sort({ name: 1, createdAt: 1 }).exec();

    return clients;
  };
}

export const ClientProvider = {
  provide: ClientService,
  useClass: ClientService,
};
