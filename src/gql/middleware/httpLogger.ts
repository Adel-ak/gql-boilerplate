import bunyan from 'bunyan';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { resolvePath } from '../../utils/path.js';
import { Middleware } from '../../shared/types/graphql-modules.js';

dayjs.extend(utc);

const now = dayjs().utc().format('DD-MM-YYYY');

const path = resolvePath(import.meta.url, ['..', '..', '..', `logs/${now}.log`]);

const bunyanLogger = bunyan.createLogger({
  name: 'GQL_Logger',
  streams: [
    {
      path,
    },
  ],
});

const httpLogger = (): Middleware => {
  return async ({ context }, next) => {
    const res = await next();

    const log = context?.log;

    if (log) {
      const { type: logType, msg, ...logData } = log;
      bunyanLogger[logType || 'info'](logData, msg);
    }

    return res;
  };
};

export default httpLogger;
