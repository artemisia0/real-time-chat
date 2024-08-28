import Chat from '../../mongooseModels/Chat'


export default async function renameChat(_: any, { chatID, name }: { chatID: string; name: string; }) {
	await Chat.findOneAndUpdate({ _id: chatID }, { name })
	return {
		ok: true,
		message: "Successfully renamed chat.",
	}
}

