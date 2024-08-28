import UserChatRelation from '../../mongooseModels/UserChatRelation'


export default async function removeChatMember(_: any, { username, chatID }: { username: string; chatID: string; }) {
	await UserChatRelation.findOneAndDelete({ username, chatID })
	return {
		status: {
			ok: true,
			message: "Successfully removed chat member.",
		}
	}
}

