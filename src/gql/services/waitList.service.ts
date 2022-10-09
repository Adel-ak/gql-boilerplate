import { Injectable, Scope } from 'graphql-modules';
import { AppPropertiesModel } from '../../db/model/appProperties.model.js';
import { IUser } from '../../db/model/user.model.js';
import { IWish, WishModel } from '../../db/model/wish.model.js';
import { GQL_AddToWishListInput, GQL_FieldErrors } from '../../generated-types/graphql.js';
import { ReqError } from '../../shared/types/gql.type.js';
import { GoResponse, TObjectId } from '../../shared/types/index.js';

@Injectable({
  global: true,
  scope: Scope.Singleton,
})
export class WishService {
  addToList = async (input: GQL_AddToWishListInput, authUser: IUser): GoResponse<IWish, ReqError | GQL_FieldErrors> => {
    try {
      const [clientWishes, appConfig] = await Promise.all([
        this.getClientWishes(input.client),
        AppPropertiesModel.findOne({}).exec(),
      ]);

      if (appConfig) {
        const maxWishes = appConfig.maxWishPerClient;
        if (maxWishes && clientWishes.length >= maxWishes) {
          return [
            null,
            new ReqError({
              message: `The client has reached the maximum number (${maxWishes}) of watches they can wish for.`,
            }),
          ];
        }
      }

      const wish = new WishModel({
        ...input,
        store: authUser.store,
        createdBy: authUser._id,
        _v: 0,
      });

      await wish.save();

      return [wish, null];
    } catch (err) {
      return [null, new ReqError()];
    }
  };

  getClientWishes = async (clientID: TObjectId): Promise<IWish[]> => {
    const whishes = await WishModel.find({ client: clientID });

    return whishes;
  };
}

export const WishProvider = {
  provide: WishService,
  useClass: WishService,
};
