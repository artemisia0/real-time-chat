import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { ApolloClient, InMemoryCache } from '@apollo/client'


const link = new GraphQLWsLink(
  createClient({
    url: process.env.NEXT_PUBLIC_ENV_PRODUCTION 
         ? process.env.NEXT_PUBLIC_GRAPHQL_API_PRODUCTION_URI 
         : "ws://localhost:4000/graphql",
    on: {
      connected: () => console.log("Connected to the WebSocket server"),
      closed: () => console.log("WebSocket connection closed"),
      error: (err) => console.error("WebSocket error:", err),
    },
  }),
);

const client = new ApolloClient({
	link,
	cache: new InMemoryCache()
})

export default client
 
