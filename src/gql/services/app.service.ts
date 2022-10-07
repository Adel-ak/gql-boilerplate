import { Injectable, Scope } from 'graphql-modules';
import { AppPropertiesSchema } from '../../db/schema/appProperties.schema.js';
import { GQL_UpdateAppPropertiesInput } from '../../generated-types/graphql.js';

@Injectable({
  global: true,
  scope: Scope.Singleton,
})
export class AppService {
  getProperties = () => AppPropertiesSchema.findOne().exec();
  updateProperties = (input: GQL_UpdateAppPropertiesInput) => {
    return AppPropertiesSchema.findOneAndUpdate({}, input, { new: true }).exec();
  };
}

export const AppProvider = {
  provide: AppService,
  useClass: AppService,
};
