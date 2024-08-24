import UserChatRelation from '@/mongooseModels/UserChatRelation'


export default async function addChatMember(_: any, { chatID, username, role }: { chatID: string; username: string; role: string; }) {
	const newUserChatRelation = new UserChatRelation({ chatID, username, role })
	await newUserChatRelation.save()

	return {
		status: {
			ok: true,
			message: "Successfully added chat member.",
		}
	}
}

