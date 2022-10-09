import cors, { CorsOptions } from 'cors';
import { Express } from 'express';
import { Env } from '../config/env.js';

export const corsMiddleware = async (app: Express) => {
  const { PORT, IS_DEV } = Env;

  const originWhitelist = [
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`,
    `http://localhost:${PORT}/graphql`,
    `http://127.0.0.1:${PORT}/graphql`,
    'electron://altair',
  ];

  const corsOptions: CorsOptions = {
    origin: function (origin: any, callback: any) {
      if (originWhitelist.indexOf(origin) !== -1 || !origin || IS_DEV) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['*'],
    credentials: true,
  };

  app.use(cors(corsOptions));
};
