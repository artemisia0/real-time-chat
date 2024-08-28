import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';


const production = process.env.NEXT_PUBLIC_ENV_PRODUCTION == 'true'

console.log("PRODUCTION MODE = ", production.toString())
console.log("HTTP_SERVER_PRODUCTION_URI = ", process.env.NEXT_PUBLIC_HTTP_SERVER_PRODUCTION_URI)

// Create an HTTP link for regular queries and mutations
const httpLink = new HttpLink({
  uri: production ? process.env.NEXT_PUBLIC_HTTP_SERVER_PRODUCTION_URI! : "http://localhost:4000",
});

// Create a WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: production ? process.env.NEXT_PUBLIC_WS_SERVER_PRODUCTION_URI! : "ws://localhost:4000",
  })
);

// Use split to send data to each link based on the operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

// Create Apollo Client
const gqlClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default gqlClient;

