import signIn from '@/graphql/resolvers/mutation/signIn'
import signUp from '@/graphql/resolvers/mutation/signUp'
import signOut from '@/graphql/resolvers/mutation/signOut'
import createChat from '@/graphql/resolvers/mutation/createChat'
import leaveChat from '@/graphql/resolvers/mutation/leaveChat'
import chats from '@/graphql/resolvers/query/chats'
import renameChat from '@/graphql/resolvers/mutation/renameChat'
import { DateTimeResolver } from 'graphql-scalars'
import messages from '@/graphql/resolvers/query/messages'
import createMessage from '@/graphql/resolvers/mutation/createMessage'


const resolvers = {
	DateTime: DateTimeResolver,
	Query: {
		chats,
		messages,
	},
	Mutation: {
		signIn,
		signUp,
		signOut,
		createChat,
		leaveChat,
		renameChat,
		createMessage,
	}
}

export default resolvers

