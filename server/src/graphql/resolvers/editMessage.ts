import Message from '../../mongooseModels/Message'


export default async function editMessage(_: any, { messageID, newMessageContents }: { messageID: string; newMessageContents: string; }) {
	await Message.findOneAndUpdate({ _id: messageID }, { contents: newMessageContents })

	return {
		status: {
			ok: true,
			message: "Successfully edited message.",
		}
	}
}

