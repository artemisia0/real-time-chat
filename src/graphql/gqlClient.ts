import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { ApolloClient, InMemoryCache } from '@apollo/client'


const link = new GraphQLWsLink(
  createClient({
		url: process.env.NEXT_PUBLIC_ENV_PRODUCTION ? process.env.NEXT_PUBLIC_GRAPHQL_API_PRODUCTION_URI! : "ws://localhost:4000/graphql",
  }),
);

const client = new ApolloClient({
	link,
	cache: new InMemoryCache()
})

export default client
 
