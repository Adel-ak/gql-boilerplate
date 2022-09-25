import { AccessPermissions } from '../enums.js';

export type NConf = {
  waitListPerClientLimit: number;
  permissions: AccessPermissions[];
  branches: string[];
};
