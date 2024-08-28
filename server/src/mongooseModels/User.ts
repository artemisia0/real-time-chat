import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
	username: String,
	hashedPassword: String,
})

const User = mongoose.models.User ?? mongoose.model('User', userSchema)

export default User

