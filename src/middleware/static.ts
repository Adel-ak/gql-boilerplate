import { Express, static as exStatic } from 'express';
import { resolvePath } from '../utils/path.js';

export const staticMiddleware = (app: Express) => {
  const buildFolder = '../../../client/build';
  const htmlPath = resolvePath(import.meta.url, [buildFolder, 'index.html']);

  // Static
  app.use(exStatic(resolvePath(import.meta.url, [buildFolder])));
  app.use('/favicon/*', exStatic(resolvePath(import.meta.url, [buildFolder, 'favicon'])));
  app.use('*', (_, res) => {
    return res.sendFile(htmlPath);
  });
};
