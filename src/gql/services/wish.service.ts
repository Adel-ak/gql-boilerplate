import dayjs from 'dayjs';
import { Injectable, Scope } from 'graphql-modules';
import { FilterQuery, PaginateOptions } from 'mongoose';
import { errorCode } from '../../constants/errors.js';
import { StatusLifeCycle, StatusNotAllowedByRole } from '../../constants/status.js';
import { AppPropertiesModel } from '../../db/model/appProperties.model.js';
import { ClientModel } from '../../db/model/client.model.js';
import { IUser } from '../../db/model/user.model.js';
import { WatchModel } from '../../db/model/watch.model.js';
import { IWish, IWishDocument, WishModel } from '../../db/model/wish.model.js';
import {
  GQL_CreateWishInput,
  GQL_EWishStatus,
  GQL_FieldErrors,
  GQL_ListWishesInput,
  GQL_ListWishesResult,
  GQL_UpdateWishStatusInput,
  GQL_User,
} from '../../generated-types/graphql.js';
import { FieldErrors, ReqError } from '../../shared/types/gql.type.js';
import { GoResponse, TObjectId } from '../../shared/types/index.js';

@Injectable({
  global: false,
  scope: Scope.Singleton,
})
export class WishService {
  create = async (input: GQL_CreateWishInput, authUser: IUser): GoResponse<IWish, ReqError | GQL_FieldErrors> => {
    try {
      const [client, watch] = await Promise.all([
        ClientModel.findOne({ cid: input.clientCid }).exec(),
        WatchModel.findOne({ code: input.watchCode }).exec(),
      ]);

      if (!client || !watch) {
        const fe = new FieldErrors();
        if (!client) fe.fieldErrors.push({ field: 'clientCid', message: 'Client not found.' });
        if (!watch) fe.fieldErrors.push({ field: 'watchCode', message: 'Watch not found.' });
        return [null, fe];
      }

      const err = await this.canClientWish(client._id, watch.code);
      if (err) {
        if (err.code === errorCode.wish.sameWatchModel) {
          const fe = new FieldErrors([{ field: 'watchCode', message: err.message }]);
          return [null, fe];
        }
        return [null, err];
      }

      const authUserId = authUser._id;

      const now = dayjs().utc().toDate();

      const wish = new WishModel({
        clientId: client._id,
        clientName: client.name,
        clientCid: client.cid,
        clientPhone: client.phone,
        watchId: watch._id,
        watchCode: watch.code,
        watchName: watch.name,
        user: authUserId,
        store: input.store,
        remark: input.remark,
        status: GQL_EWishStatus.Pending,
        statusHistory: [
          {
            at: now,
            user: authUserId,
            status: GQL_EWishStatus.Pending,
          },
        ],
        expectedDate: input.expectedDate,
        createdAt: now,
        _v: 0,
      });

      await wish.save();

      return [wish, null];
    } catch (err: any) {
      return [null, new ReqError()];
    }
  };

  private canClientWish = async (clientId: TObjectId, watchCode: string): Promise<ReqError | void> => {
    try {
      const { Cancelled, Completed } = GQL_EWishStatus;
      const [clientWishes, appConfig] = await Promise.all([
        WishModel.find({ clientId: clientId, status: { $ne: Cancelled } })
          .sort({ status: 1, watchCode: 1 })
          .exec(),
        AppPropertiesModel.findOne({}).exec(),
      ]);

      const maxWishes = appConfig!.maxWishPerClient;
      const notCompletedWishes = clientWishes.filter((x) => x.status !== Completed);

      if (notCompletedWishes.length >= maxWishes) {
        return new ReqError({
          message: `The client has reached the maximum number (${maxWishes}) of watches they can wish for.`,
        });
      }

      // Checking if client has the requesting watch code as a wish, as a client can receive only one model in a life time
      const watchIndex = clientWishes.findIndex((x) => x.watchCode === watchCode);

      if (watchIndex !== -1) {
        return new ReqError({
          code: errorCode.wish.sameWatchModel,
          message: `Clients cannot wish for the same model twice.`,
        });
      }
    } catch {
      return new ReqError();
    }
  };

  updateStatus = async (
    input: GQL_UpdateWishStatusInput,
    authUser: IUser,
  ): GoResponse<IWish, ReqError | FieldErrors> => {
    try {
      const wish = await WishModel.findById(input._id).exec();
      if (!wish) {
        return [null, new ReqError({ message: 'Wish not found' })];
      }

      if (wish.status !== input.status) {
        const isNotAllowedToChange = StatusNotAllowedByRole[authUser.role].indexOf(input.status) !== -1;
        const isAllowedToChange = StatusLifeCycle[input.status].indexOf(input.status) !== -1;
        if (isNotAllowedToChange || isAllowedToChange) {
          return [null, new ReqError({ message: 'Unauthorized Change.' })];
        }
        const now = dayjs().utc().toDate();
        wish.status = input.status;
        wish._v = wish._v + 1;
        wish.updatedAt = now;
        wish.statusHistory.push({
          at: now,
          status: input.status,
          user: authUser._id as unknown as GQL_User,
        });
      }

      await wish.save();

      return [wish.toObject(), null];
    } catch {
      return [null, new ReqError()];
    }
  };

  getWishesList = async (input: GQL_ListWishesInput, authUser: IUser): Promise<GQL_ListWishesResult> => {
    const inputOptions = input.options || {};

    const page = inputOptions.page || 1;

    const maxLimit = 20;

    let limit = inputOptions.limit || maxLimit;
    limit = limit > maxLimit ? maxLimit : limit;

    const options: PaginateOptions = {
      ...(inputOptions as PaginateOptions),
      page,
      limit,
    };

    const filter: FilterQuery<IWishDocument> = {};

    const clientIds = input.filter?.clientIds;
    const watchIds = input.filter?.watchIds;
    const stores = authUser.store ? [authUser.store] : input.filter?.store;
    const status = input.filter?.status;
    const startDate = input.filter?.startDate;
    const endDate = input.filter?.endDate;

    if (clientIds?.length) filter.clientId = { $in: clientIds };
    if (watchIds?.length) filter.watchId = { $in: watchIds };
    if (stores?.length) filter.store = { $in: stores };
    if (status?.length) filter.status = { $in: status };
    if (status?.length) filter.status = { $in: status };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    const wishes = await WishModel.paginate(filter, options);

    return wishes;
  };
}

export const WishProvider = {
  provide: WishService,
  useClass: WishService,
};
