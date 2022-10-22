import { parse } from 'graphql';
import chalk from 'chalk';
import { Express, Request } from 'express';
import morgan from 'morgan';

const getOpName = (body: string) => {
  try {
    return parse(body).definitions[0]['selectionSet']['selections'][0].name.value;
  } catch {
    return '';
  }
};

export const morganMiddleware = (app: Express) => {
  morgan.token('opName', (req: Request) => {
    const body = req.body;
    if (body) {
      if (body.operationName) return body.operationName;
      return getOpName(body.query);
    }
    return '';
  });

  const morganMiddleware = morgan((tokens, req, res) => {
    const url = tokens.url(req, res);
    if (url !== '/graphql')
      return [
        tokens.method(req, res),
        url,
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');

    const method = tokens.method(req, res);

    const status = tokens.status(req, res);
    const resTime = tokens['response-time'](req, res);
    const resContentLength = tokens.res(req, res, 'content-length') || '';

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

  app.use(morganMiddleware);
};
