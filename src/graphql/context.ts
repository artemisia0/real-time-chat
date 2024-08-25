import { getSessionData } from '@/actions/session'
import { connectToDB } from '@/actions/db'
import type { NextRequest } from 'next/server'
import { PubSub } from 'graphql-subscriptions';


const pubsub = new PubSub

const context = async (req: NextRequest) => {
	await connectToDB()
	return {
		pubsub,
	}
}

export default context

