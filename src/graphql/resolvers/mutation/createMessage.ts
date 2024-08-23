import Message from '@/mongooseModels/Message'


export default async function createMessage(_: any, { chatID, contents, authorUsername, date }: { chatID: string; contents: string; authorUsername: string; date: Date; }) {
	const newMessage = new Message({ chatID, contents, authorUsername, date })
	await newMessage.save()

	return {
		status: {
			ok: true,
			message: "Successfully created new message.",
		},
		newMessage
	}
}

