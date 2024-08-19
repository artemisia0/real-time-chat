import UserChatRelation from '@/mongooseModels/UserChatRelation'


export default async function leaveChat(_: any, { username, chatID }: { username: string; chatID: string }) {
	await UserChatRelation.findOneAndDelete({ username, chatID })
	return {
		ok: true,
		message: "Successfully leaved a chat.",
	}
}

