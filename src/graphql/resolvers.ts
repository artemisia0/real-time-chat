import signIn from '@/graphql/resolvers/mutation/signIn'
import signUp from '@/graphql/resolvers/mutation/signUp'
import signOut from '@/graphql/resolvers/mutation/signOut'
import createChat from '@/graphql/resolvers/mutation/createChat'
import chats from '@/graphql/resolvers/query/chats'


const resolvers = {
	Query: {
		chats,
	},
	Mutation: {
		signIn,
		signUp,
		signOut,
		createChat,
	}
}

export default resolvers

