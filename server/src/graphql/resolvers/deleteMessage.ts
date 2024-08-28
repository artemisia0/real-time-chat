import Message from '../../mongooseModels/Message'


export default async function deleteMessage(_: any, { messageID }: { messageID: string; }) {
	await Message.findByIdAndDelete(messageID)

	return {
		status: {
			ok: true,
			message: "Successfully deleted message.",
		}
	}
}

