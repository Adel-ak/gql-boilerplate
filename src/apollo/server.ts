import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
  GraphQLExecutor,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import { GraphQLSchema } from 'graphql';
import { crunch } from 'graphql-crunch';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { Server } from 'http';
import { parse } from 'url';
import { startApolloSocketServer } from './ws.js';
import { Env } from '../config/env.js';

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
      GQL_PLAYGROUND
        ? ApolloServerPluginLandingPageGraphQLPlayground({
            settings: {
              'schema.polling.enable': false,
              'editor.reuseHeaders': true,
              'tracing.hideTracingResponse': false,
              'request.credentials': 'include',
            },
          })
        : ApolloServerPluginLandingPageDisabled(),
    ];

    const apolloServer = new ApolloServer({
      allowBatchedHttpRequests: true,
      introspection: GQL_PLAYGROUND,
      schema,
      plugins,
      executor,
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
      context: (ctx) => {
        return { ...ctx };
      },
    });

    app.use('/graphql', graphqlUploadExpress({ maxFiles: 10 }));

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, cors: false });

    return apolloServer;
  } catch (err) {
    process.exit(1);
  }
};
