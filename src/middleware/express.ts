import cors, { CorsOptions } from 'cors';
import helmet, { HelmetOptions } from 'helmet';
import compression from 'compression';
import rateLimit, { Options } from 'express-rate-limit';
import { Env } from '../config/env.js';
import morgan from 'morgan';
import chalk from 'chalk';
import express, { Express, Request, json, urlencoded } from 'express';
import path from 'path';
import { __dirname } from '../utils/path.js';
import cookieParser from 'cookie-parser';
import { altairExpress } from 'altair-express-middleware';

export const initExpressMiddleware = async (app: Express) => {
  const { PORT, IS_DEV, THROTTLE_LIMIT, THROTTLE_TTL, GQL_PLAYGROUND } = Env;

  const originWhitelist = [
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`,
    `http://localhost:${PORT}/graphql`,
    `http://127.0.0.1:${PORT}/graphql`,
    'electron://altair',
  ];

  const corsOptions: CorsOptions = {
    origin: function (origin: any, callback: any) {
      if (originWhitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['*'],
    credentials: true,
  };

  const helmetOptions: HelmetOptions = {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  };

  const rateLimitOptions = {
    max: THROTTLE_LIMIT,
    windowMs: THROTTLE_TTL,
    skip: (req) => {
      const isApi = req.url.includes('/api');
      if (isApi) return false;
      return true;
    },
  } as Partial<Options>;

  morgan.token('opName', (req: Request) => {
    const body = req.body;
    if (body) {
      if (body.operationName) return body.operationName;
      const operationName = (req.body.query as string)?.replace(/\s+/g, '').replace(/.([a-zA-Z]+).+/, '$1');
      return operationName;
    }
    return '';
  });

  const morganMiddleware = morgan((tokens, req, res) => {
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const status = tokens.status(req, res);
    const resTime = tokens['response-time'](req, res);
    const resContentLength = tokens.res(req, res, 'content-length');

    const opName = tokens.opName(req, res) || '';
    let logColor = '#ffffff';
    if (resTime) {
      if (parseFloat(resTime) >= 5000) {
        logColor = '#fb4628';
      } else if (parseFloat(resTime) >= 2000) {
        logColor = '#ffbf00';
      }
    }

    const log: string = chalk
      .hex(logColor)
      .bold(`🚀 ${resTime} ms ---> ${method} ${url} ${status} - ${resContentLength} ${opName}`);
    return log;
  });

  if (IS_DEV) {
    const imagesFolderPath = path.join(__dirname(import.meta.url), '../..', 'uploads');
    app.use(express.static(imagesFolderPath));
  }
  app.use(cookieParser());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(helmet(helmetOptions));
  app.use(rateLimit(rateLimitOptions));
  app.use(morganMiddleware);
  if (GQL_PLAYGROUND) {
    app.use(
      '/graphql',
      altairExpress({
        endpointURL: '/graphql',
        subscriptionsEndpoint: `ws://localhost:${PORT}/graphql`,
      }),
    );
  }
};
