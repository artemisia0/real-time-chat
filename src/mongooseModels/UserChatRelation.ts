import mongoose from 'mongoose'


const UserChatRelationSchema = new mongoose.Schema({
	username: String,
	userRole: String,  // 'admin' | 'member' | 'creator'
	chatID: String,
})

const UserChatRelation = mongoose.models.UserChatRelation || mongoose.model('UserChatRelation', UserChatRelationSchema)

export default UserChatRelation

