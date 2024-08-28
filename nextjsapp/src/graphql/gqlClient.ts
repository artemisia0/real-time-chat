import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';


const production = true

// Create an HTTP link for regular queries and mutations
const httpLink = new HttpLink({
  uri: production ? "https://real-time-chat-production-99c6.up.railway.app:4000/api/graphql" : "http://localhost:4000/api/graphql",
});

// Create a WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: production ? "wss://real-time-chat-production-99c6.up.railway.app:4000/api/graphql" : "ws://localhost:4000/api/graphql",
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

