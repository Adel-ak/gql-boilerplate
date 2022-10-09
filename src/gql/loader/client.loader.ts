import DataLoader from 'dataloader';
import { ClientModel, IClient } from '../../db/model/client.model.js';
import { TObjectId } from '../../shared/types/index.js';
import { groupBy } from '../../utils/array.js';

export const clientLoader = () =>
  new DataLoader<TObjectId, IClient>(async (ids) => {
    const clients = await ClientModel.find({ _id: { $in: [...new Set(ids)] } }).exec();
    const clientsGrouped = groupBy(clients, (x) => x._id);
    const data = ids.map((x) => clientsGrouped[x.toString()][0]);
    return data;
  });
