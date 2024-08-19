import UserChatRelation from '@/mongooseModels/UserChatRelation'
import Chat from '@/mongooseModels/Chat'


export default async function chats(_: any, { username }: { username: string }) {
	const relations = await UserChatRelation.find(
		{ username },
		{ chatID: true },
	)
	const chats = []
	for (let { chatID } of relations) {
		chats.push(await Chat.findOne({ _id: chatID }))
	}

	return chats
}

