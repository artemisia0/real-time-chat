import { getSessionData } from '../lib/session'
import { connectToDB } from '../lib/db'
import { PubSub } from 'graphql-subscriptions';
import { Request, Response } from 'express'


const pubsub = new PubSub

const context = async ({req, res}: {req: Request, res: Response}) => {
	await connectToDB()
	return {
		pubsub,
	}
}

export default context

