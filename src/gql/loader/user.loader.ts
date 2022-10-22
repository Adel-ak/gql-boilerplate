import DataLoader from 'dataloader';
import { IUser, UserModel } from '../../db/model/user.model.js';
import { TObjectId } from '../../shared/types/index.js';
import { groupBy } from '../../utils/array.js';

export const userLoader = () =>
  new DataLoader<TObjectId, IUser>(async (ids) => {
    const clients = await UserModel.find({ _id: { $in: [...new Set(ids)] } }).exec();
    const clientsGrouped = groupBy(clients, (x) => x._id);
    const data = ids.map((x) => clientsGrouped[x.toString()][0]);
    return data;
  });
