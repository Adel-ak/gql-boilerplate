import { config } from 'dotenv';
import { resolvePath } from './path.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
const NODE_ENV = process.env['NODE_ENV'];

const ENV = NODE_ENV ? `.${NODE_ENV}` : '';

const envPath = resolvePath(import.meta.url, ['..', '..', `.env${ENV}`]);

config({ path: envPath, override: true });
