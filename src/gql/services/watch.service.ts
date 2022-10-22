import escapeStringRegexp from 'escape-string-regexp';
import { Injectable, Scope } from 'graphql-modules';
import { WatchModel, IWatch } from '../../db/model/watch.model.js';
import { GQL_FilterWatchesInput } from '../../generated-types/graphql.js';

@Injectable({
  global: false,
  scope: Scope.Singleton,
})
export class WatchService {
  filterWatches = async (input: GQL_FilterWatchesInput): Promise<IWatch[]> => {
    const filter: Record<string, any> = {};
    if (input.search) {
      const regex = { $regex: new RegExp(`${escapeStringRegexp(input.search)}`, 'gi') };

      filter.$or = [{ name: regex }, { code: regex }];
    }

    const watches = await WatchModel.find(filter).limit(20).sort({ name: 1, createdAt: 1 }).exec();

    return watches;
  };
}

export const WatchProvider = {
  provide: WatchService,
  useClass: WatchService,
};
