import mongoose from 'mongoose'


const messageSchema = new mongoose.Schema({
	chatID: String,
	authorUsername: String,
	contents: String,
	date: Date,
})

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema)

export default Message

