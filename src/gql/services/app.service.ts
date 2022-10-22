import { Injectable, Scope } from 'graphql-modules';
import { StatusLifeCycle, StatusNotAllowedByRole } from '../../constants/status.js';
import { AppPropertiesModel, IAppProperties } from '../../db/model/appProperties.model.js';
import { GQL_AppProperties, GQL_ERoles, GQL_UpdateAppPropertiesInput } from '../../generated-types/graphql.js';
import { enumValues } from '../../utils/index.js';

@Injectable({
  global: true,
  scope: Scope.Singleton,
})
export class AppService {
  getProperties = async (): Promise<GQL_AppProperties> => {
    const defaultAppProperties = {
      wishStatusLifeCycle: JSON.stringify(StatusLifeCycle),
      wishStatusNotAllowedByRole: JSON.stringify(StatusNotAllowedByRole),
      maxWishPerClient: 2,
      roles: enumValues(GQL_ERoles),
      stores: ['01-Salhiya', '05-Avenues', '06-Gate-Mall', '08-Assima-Mall'],
    };

    try {
      const { wishStatusLifeCycle, wishStatusNotAllowedByRole, maxWishPerClient, roles, stores } = defaultAppProperties;
      const appProperties = await AppPropertiesModel.findOne({}).exec();

      return {
        wishStatusLifeCycle,
        wishStatusNotAllowedByRole,
        maxWishPerClient: appProperties?.maxWishPerClient || maxWishPerClient,
        roles: appProperties?.roles || roles,
        stores: appProperties?.stores || stores,
      };
    } catch {
      return defaultAppProperties as IAppProperties;
    }
  };
  updateProperties = (input: GQL_UpdateAppPropertiesInput): Promise<IAppProperties | null> => {
    return AppPropertiesModel.findOneAndUpdate({}, input, { new: true }).exec();
  };
}

export const AppProvider = {
  provide: AppService,
  useClass: AppService,
};
