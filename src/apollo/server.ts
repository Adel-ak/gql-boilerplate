import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled,
  GraphQLExecutor,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import { GraphQLSchema } from 'graphql';
import { crunch } from 'graphql-crunch';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { Server } from 'http';
import { parse } from 'url';
import { Env } from '../config/env.js';
import { clientLoader, watchLoader, userLoader } from '../gql/loader/index.js';
import { DataLoader } from '../shared/types/loader.type.js';
import { wait } from '../utils/index.js';
import { startApolloSocketServer } from './ws.js';

export const startApolloServer = async (
  schema: GraphQLSchema,
  executor: GraphQLExecutor,
  app: Express,
  httpServer: Server,
): Promise<ApolloServer> => {
  try {
    const { GQL_PLAYGROUND } = Env;
    const serverCleanup = await startApolloSocketServer(schema, httpServer);

    const plugins = [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageDisabled(),
    ];

    const apolloServer = new ApolloServer({
      allowBatchedHttpRequests: true,
      introspection: GQL_PLAYGROUND,
      schema,
      plugins,
      executor,
      csrfPrevention: true,
      cache: 'bounded',
      formatResponse: (response, options) => {
        const url = (options.context as any).req.url;
        const crunchVersion = (parse(url, true).query['crunch'] as string) || null;
        if (crunchVersion && response.data) {
          const version = parseInt(crunchVersion);
          response.data = crunch(response.data, version);
        }

        return response;
      },

      context: async (ctx) => {
        await wait(0.3);
        const loaders: DataLoader = {
          clientLoader: clientLoader(),
          watchLoader: watchLoader(),
          userLoader: userLoader(),
        };
        return { ...ctx, loaders };
      },
    });

    app.use('/graphql', graphqlUploadExpress({ maxFiles: 10 }));

    await apolloServer.start();

    apolloServer.applyMiddleware({
      app,
      cors: false,
    });

    return apolloServer;
  } catch (err) {
    process.exit(1);
  }
};
