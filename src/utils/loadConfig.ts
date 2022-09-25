import { config } from 'dotenv';
import { resolvePath } from './path.js';
import nconf from 'nconf';
import { NConf } from '../shared/types/nconf.js';
import { enumValues } from './index.js';
import { AccessPermissions } from '../shared/enums.js';

const NODE_ENV = process.env['NODE_ENV'];

const ENV = NODE_ENV ? `.${NODE_ENV}` : '';

const envPath = resolvePath(import.meta.url, ['..', '..', `.env${ENV}`]);

config({ path: envPath, override: true });

const configPath = resolvePath(import.meta.url, ['..', '..', 'config.json']);

nconf.file({ file: configPath });

const nConfigDefaults: NConf = {
  branches: [],
  permissions: enumValues(AccessPermissions),
  waitListPerClientLimit: 2,
};

nconf.defaults(nConfigDefaults);
