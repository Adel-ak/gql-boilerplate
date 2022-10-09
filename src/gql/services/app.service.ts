import { Injectable, Scope } from 'graphql-modules';
import { AppPropertiesModel, IAppProperties } from '../../db/model/appProperties.model.js';
import { GQL_UpdateAppPropertiesInput } from '../../generated-types/graphql.js';

@Injectable({
  global: true,
  scope: Scope.Singleton,
})
export class AppService {
  getProperties = (): Promise<IAppProperties | null> => AppPropertiesModel.findOne({}).exec();
  updateProperties = (input: GQL_UpdateAppPropertiesInput): Promise<IAppProperties | null> => {
    return AppPropertiesModel.findOneAndUpdate({}, input, { new: true }).exec();
  };
}

export const AppProvider = {
  provide: AppService,
  useClass: AppService,
};
