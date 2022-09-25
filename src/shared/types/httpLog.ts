import { LogLevelString } from 'bunyan';

export type HttpLog = {
  type?: LogLevelString;
  user: string;
  action: string;
  msg: string;
  [key: string]: any;
};
