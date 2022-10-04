import { LogLevelString } from 'bunyan';

export interface HttpLog {
  type?: LogLevelString;
  user?: string;
  role?: string;
  action: string;
  msg: string;
  [key: string]: any;
}
