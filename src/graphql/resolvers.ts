import signIn from '@/graphql/resolvers/mutation/signIn'
import signUp from '@/graphql/resolvers/mutation/signUp'
import signOut from '@/graphql/resolvers/mutation/signOut'


const resolvers = {
	Query: {
		hello: () => 'world',
	},
	Mutation: {
		signIn,
		signUp,
		signOut,
	}
}

export default resolvers

