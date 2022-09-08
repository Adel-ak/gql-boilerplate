import { execute, GraphQLSchema, subscribe } from 'graphql';
import { Disposable } from 'graphql-ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { Server } from 'http';
import { WebSocketServer } from 'ws';
import { Env } from '../config/env.js';

export const startApolloSocketServer = async (
  schema: GraphQLSchema,
  server: Server,
  path = '/graphql',
): Promise<Disposable> => {
  try {
    const keepAlive = 12000;
    const serverOptions = {
      schema,
      execute,
      subscribe,
      onConnect: () => {
        console.log('USER CONNECTED');
      },
      onDisconnect: () => {
        console.warn('USER DISCONNECTED');
      },
    };

    const wsServer = new WebSocketServer({
      server,
      path,
    });

    wsServer.on('listening', () => {
      console.log(`🚀 Apollo Socket Server listening at ws://localhost:${Env.PORT}${path}`);
    });

    return useServer(serverOptions, wsServer, keepAlive);
  } catch (err) {
    process.exit(1);
  }
};
