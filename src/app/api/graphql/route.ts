import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import type { NextRequest } from 'next/server'
import resolvers from '@/graphql/resolvers'
import typeDefs from '@/graphql/typeDefs'
import { getSessionData } from '@/actions/session'


const server = new ApolloServer({
	resolvers,
	typeDefs,
})

const context = async (req: NextRequest) => {
	const sessionData = await getSessionData()
	return {
		sessionData
	}
}

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
	context
})

export { handler as GET, handler as POST }

