import signIn from './resolvers/signIn'
import signUp from './resolvers/signUp'
import signOut from './resolvers/signOut'
import createChat from './resolvers/createChat'
import leaveChat from './resolvers/leaveChat'
import chats from './resolvers/chats'
import renameChat from './resolvers/renameChat'
import { DateTimeResolver } from 'graphql-scalars'
import messages from './resolvers/messages'
import createMessage from './resolvers/createMessage'
import editMessage from './resolvers/editMessage'
import deleteMessage from './resolvers/deleteMessage'
import chatMembers from './resolvers/chatMembers'
import removeChatMember from './resolvers/removeChatMember'
import addChatMember from './resolvers/addChatMember'
import updateChatMemberRole from './resolvers/updateChatMemberRole'


const resolvers = {
	DateTime: DateTimeResolver,
	Query: {
		chats,
		messages,
		chatMembers,
	},
	Mutation: {
		signIn,
		signUp,
		signOut,
		createChat,
		leaveChat,
		renameChat,
		createMessage,
		editMessage,
		deleteMessage,
		removeChatMember,
		addChatMember,
		updateChatMemberRole,
	},
	Subscription: {
		newMessage: {
			subscribe: (_: any, { chatID }: { chatID: string }, context: object) => {
				const { pubsub } = context as any
				return pubsub.asyncIterator([`NEW_MESSAGE_${chatID}`])
			}
		}
	}
}

export default resolvers

