import Message from '../../mongooseModels/Message'


export default async function messages(_: any, { chatID }: { chatID: string; }) {
	const messages = await Message
		.find({ chatID })
		.sort({ date: 1 })

	return messages
}

