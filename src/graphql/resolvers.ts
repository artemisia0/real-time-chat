import signIn from '@/graphql/resolvers/mutation/signIn'
import signUp from '@/graphql/resolvers/mutation/signUp'
import signOut from '@/graphql/resolvers/mutation/signOut'
import createChat from '@/graphql/resolvers/mutation/createChat'
import leaveChat from '@/graphql/resolvers/mutation/leaveChat'
import chats from '@/graphql/resolvers/query/chats'
import renameChat from '@/graphql/resolvers/mutation/renameChat'


const resolvers = {
	Query: {
		chats,
	},
	Mutation: {
		signIn,
		signUp,
		signOut,
		createChat,
		leaveChat,
		renameChat,
	}
}

export default resolvers

