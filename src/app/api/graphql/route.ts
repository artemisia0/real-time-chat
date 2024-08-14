import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import type { NextRequest } from 'next/server'
import resolvers from '@/graphql/resolvers'
import typeDefs from '@/graphql/typeDefs'


const server = new ApolloServer({
	resolvers,
	typeDefs,
})

const handler = startServerAndCreateNextHandler(server)

export { handler as GET, handler as POST }

