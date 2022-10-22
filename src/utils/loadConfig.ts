import { config } from 'dotenv';
import { resolvePath } from './path.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import duration from 'dayjs/plugin/duration.js';
import { existsSync, mkdirSync } from 'fs';

const logsFolderPath = resolvePath(import.meta.url, ['..', '..', 'logs']);

if (!existsSync(logsFolderPath)) {
  mkdirSync(logsFolderPath);
}

dayjs.extend(utc);
dayjs.extend(duration);

const NODE_ENV = process.env['NODE_ENV'];

const ENV = NODE_ENV ? `.${NODE_ENV}` : '';

const envPath = resolvePath(import.meta.url, ['..', '..', `.env${ENV}`]);

config({ path: envPath, override: true });
