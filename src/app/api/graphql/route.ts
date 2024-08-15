import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import resolvers from '@/graphql/resolvers'
import type { NextRequest } from 'next/server'
import typeDefs from '@/graphql/typeDefs'
import context from '@/graphql/context'


const server = new ApolloServer({
	resolvers,
	typeDefs,
})

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
	context
})

export { handler as GET, handler as POST }

