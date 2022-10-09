import compression from 'compression';
import cookieParser from 'cookie-parser';
import { Express, json, urlencoded } from 'express';
import helmet, { HelmetOptions } from 'helmet';
import { altairMiddleware } from './altair.js';
import { corsMiddleware } from './cors.js';
import { morganMiddleware } from './morgan.js';

export const initExpressMiddleware = async (app: Express) => {
  const helmetOptions: HelmetOptions = {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  };

  corsMiddleware(app);
  morganMiddleware(app);
  altairMiddleware(app);
  app.use(helmet(helmetOptions));
  app.use(cookieParser());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(compression());
};
