import UserChatRelation from '@/mongooseModels/UserChatRelation'
import User from '@/mongooseModels/User'


export default async function addChatMember(_: any, { chatID, username, role }: { chatID: string; username: string; role: string; }) {
	const maybeFoundUser = await User.findOne({ username })
	if (maybeFoundUser === null) {
		return {
			status: {
				ok: false,
				message: "User with provided username does not exist.",
			}
		}
	}

	const newUserChatRelation = new UserChatRelation({ chatID, username, role })
	await newUserChatRelation.save()

	return {
		status: {
			ok: true,
			message: "Successfully added chat member.",
		}
	}
}

