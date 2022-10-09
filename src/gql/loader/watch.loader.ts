import DataLoader from 'dataloader';
import { IWatch, WatchModel } from '../../db/model/watch.model.js';
import { TObjectId } from '../../shared/types/index.js';
import { groupBy } from '../../utils/array.js';

export const watchLoader = () =>
  new DataLoader<TObjectId, IWatch>(async (ids) => {
    const watches = await WatchModel.find({ _id: { $in: [...new Set(ids)] } }).exec();
    const watchesGrouped = groupBy(watches, (x) => x._id);
    const data = ids.map((x) => watchesGrouped[x.toString()][0]);
    return data;
  });
