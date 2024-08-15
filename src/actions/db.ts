'use server'

import mongoose from 'mongoose'


const connectedCallback = () => console.log("DB connection opened.")
const errorCallback = async (err: any) => {
	console.error(err)
	await mongoose.disconnect()
	process.exit(1)
}
const disconnectedCallback = () => console.log("DB connection closed.")
const sigintCallback = async () => {
	console.error('TERMINATING.')
	await mongoose.disconnect()
	process.exit(0)
}

mongoose.connection.on('connected', connectedCallback)
mongoose.connection.on('error', errorCallback)
mongoose.connection.on('disconnected', disconnectedCallback)
process.on('SIGINT', sigintCallback)

const clientOptions: mongoose.ConnectOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

export async function connectToDB() {
	if (mongoose.connection.readyState === 1) {
		return
	}

	try {
		const uri = process.env.MONGODB_CONNECTION_STRING
		if (!uri) {
			console.error('MONGODB_CONNECTION_STRING is not set.')
			process.exit(1)
		}
		await mongoose.connect(uri!, clientOptions)
	} catch (err) {
		console.error(err)
		await mongoose.disconnect()
		process.exit(1)
	}
}

