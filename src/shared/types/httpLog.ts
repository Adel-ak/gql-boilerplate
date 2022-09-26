import { LogLevelString } from 'bunyan';

export type HttpLog = {
  type?: LogLevelString;
  user?: string;
  role?: string;
  action: string;
  msg: string;
  [key: string]: any;
};
