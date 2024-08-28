import Chat from '../../mongooseModels/Chat'
import UserChatRelation from '../../mongooseModels/UserChatRelation'


export default async function createChat(_: any, args: { name: string; creatorUsername: string; }) {
	const newChat = new Chat({ name: args.name })
	await newChat.save()

	const newUserChatRelation = new UserChatRelation({
		username: args.creatorUsername,
		chatID: newChat._id,
		role: 'creator',
	})
	await newUserChatRelation.save()

	return {
		chat: {
			_id: newChat._id,
			name: newChat.name,
		},
		status: {
			ok: true,
			message: "Successfully created chat.",
		}
	}
}

