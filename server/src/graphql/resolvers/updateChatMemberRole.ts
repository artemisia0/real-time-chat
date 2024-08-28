import UserChatRelation from '../../mongooseModels/UserChatRelation'


export default async function updateChatMemberRole(_: any, { chatID, username, role }: { chatID: string; username: string; role: string; }) {
	await UserChatRelation.findOneAndUpdate({ chatID, username }, { role })

	return {
		status: {
			ok: true,
			message: "Successfully updated chat member role.",
		}
	}
}

