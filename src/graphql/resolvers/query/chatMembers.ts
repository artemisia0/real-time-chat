import UserChatRelation from '@/mongooseModels/UserChatRelation'


export default async function chatMembers(_: any, { chatID }: { chatID: string; }) {
	const userChatRelations = await UserChatRelation.find({ chatID }, { userRole: true, username: true })

	const res = userChatRelations.map((relation) => ({ role: relation.userRole ?? 'member', username: relation.username }))
	return res
}

