import Message from '@/mongooseModels/Message'


export default async function createMessage(_: any, { chatID, contents, authorUsername, date }: { chatID: string; contents: string; authorUsername: string; date: Date; }, context: object) {
	const { pubsub } = context as any
	const newMessage = new Message({ chatID, contents, authorUsername, date })
	await newMessage.save()
	pubsub.publish(`NEW_MESSAGE_${chatID}`, { newMessage })

	return {
		status: {
			ok: true,
			message: "Successfully created new message.",
		},
		newMessage
	}
}

