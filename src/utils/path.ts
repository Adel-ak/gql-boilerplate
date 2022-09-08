import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const resolvePath = (url: string, pathName: string[] = []) => {
  return path.resolve(__dirname(url), ...pathName);
};

export const __dirname = (url: string) => {
  return dirname(__filename(url));
};

export const __filename = (url: string) => {
  const __filename = fileURLToPath(url);
  return __filename;
};
