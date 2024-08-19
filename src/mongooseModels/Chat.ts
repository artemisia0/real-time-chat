import mongoose from 'mongoose'


const chatSchema = new mongoose.Schema({
	name: String,
})

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema)

export default Chat

