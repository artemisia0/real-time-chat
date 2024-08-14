import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'


const resolvers = {
	Query: {
		hello: () => 'world',
	}
}

const typeDefs = `
type Query {
	hello: String
}
`;

const server = new ApolloServer({
	resolvers,
	typeDefs,
})

const handler = startServerAndCreateNextHandler(server)

export { handler as GET, handler as POST }

