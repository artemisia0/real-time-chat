import UserChatRelation from '@/mongooseModels/UserChatRelation'


export default async function chatMembers(_: any, { chatID }: { chatID: string; }) {
	const userChatRelations = await UserChatRelation.find({ chatID }, { role: true, username: true })

	const res = userChatRelations.map((relation) => ({ role: relation.role!, username: relation.username! }))
	return res
}

