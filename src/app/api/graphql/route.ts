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

const apolloServer = new (ApolloServer as any)({
  schema,
	csrfPrevention: false,
	cors: false,
});

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

await new Promise((resolve, reject) => httpServer.listen(3002, resolve as any))

const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
  context,
});

export { handler as GET, handler as POST };

