import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import resolvers from '@/graphql/resolvers';
import typeDefs from '@/graphql/typeDefs';
import context from '@/graphql/context';
import type { NextRequest } from 'next/server';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({
  schema,
});

// Create an HTTP server and WebSocket server if not already running
const startServers = (() => {
  let started = false;
  
  return () => {
    if (!started) {
      const httpServer = createServer();
      const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/api/graphql',
      });

      wsServer.on('connection', () => {
        console.log('New WebSocket connection');
      });

      wsServer.on('error', (err: any) => {
        console.error('WebSocket server error: ', err);
      });

			/* eslint-disable react-hooks/rules-of-hooks */
      useServer({ schema, context }, wsServer);

      httpServer.listen(3002, () => {
        console.log('(WebSocket) server is listening on port 3002');
      });

      started = true;
    }
  };
})();

const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
  context,
});

startServers(); // Ensure servers are started only once

export { handler as GET, handler as POST };
