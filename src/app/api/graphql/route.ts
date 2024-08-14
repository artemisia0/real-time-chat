import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import type { NextRequest } from 'next/server'
import resolvers from '@/graphql/resolvers'
import typeDefs from '@/graphql/typeDefs'


const server = new ApolloServer({
	resolvers,
	typeDefs,
})

const context = async (req: NextRequest) => {
	// sessionData should be obtained calling something like a 'getSession' function (server action)
	return {
		sessionData: {
			userRole: '',
			username: '',
			signedIn: false,
		}
	}
}

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
	context
})

export { handler as GET, handler as POST }

