import { Injectable, Scope } from 'graphql-modules';
import nconf from 'nconf';
import { Maybe } from '../../generated-types/graphql.js';
import { GoResponse, NotArray } from '../../shared/types/index.js';

@Injectable({
  global: true,
  scope: Scope.Singleton,
})
export class NConfigService {
  /**
  * A function that takes a key and a callback function. It then gets the value of the key and passes
  * it to the callback function. The callback function returns a new value. The new value is then set
  * to the key. 
  
  * This method is should be used to easily mutate one ore more object keys. 
  */

  mutateObject = <T = any>(key: string, cb: (state: Maybe<T>) => T) => {
    let config = nconf.get(key);
    const newState = cb(config);
    return this.set<T>(key, newState);
  };

  setOrAddToArr = async <T>(key: string, value: T[]): Promise<GoResponse<T[], Error>> => {
    let old_arr: T[] = nconf.get(key) || [];

    const arr = [...new Set([...old_arr, ...value])];

    return this.set<T[]>(key, arr);
  };

  removeFromArr = async <T = any>(key: string, value: NotArray<T>): Promise<GoResponse<T[], Error>> => {
    let old_arr: T[] = nconf.get(key) || [];

    const arr = old_arr.filter((x) => {
      return x !== value;
    });

    return this.set<T[]>(key, arr);
  };

  set = async <T = any>(key: string, value: T): Promise<GoResponse<T, Error>> => {
    return new Promise((res) => {
      nconf.set(key, value, (err: Error) => {
        if (err) res([null, err]);
        else res([value, null]);
      });
    });
  };

  get = <T = any>(key: string): T => {
    return nconf.get(key);
  };

  save = async (): Promise<GoResponse<null, Error>> => {
    return new Promise((res) => {
      nconf.save((err: Error) => {
        if (err) res([null, err]);
        else res([null, null]);
      });
    });
  };
}

export const NConfigProvider = {
  provide: NConfigService,
  useClass: NConfigService,
};
