'use server'
import 'server-only'

import { sealData, unsealData } from 'iron-session'
import type SessionData from '@/types/SessionData'


const ttl = 7 * 24 * 60 * 60  // 1 week

function getSessionSecret(): string {
	if (!process.env.SESSION_SECRET) {
		console.error('SESSION_SECRET is not set.')
		process.exit(1)
	}
	return process.env.SESSION_SECRET!
}

export async function getSessionData(sessionToken: string)
: Promise<SessionData> {
	const session = await unsealData<SessionData>(
		sessionToken,
		{
			password: getSessionSecret(),
			ttl,
		}
	)
	return { ...session }
}

export async function getSessionToken(sessionData: SessionData)
: Promise<string> {
	const sessionToken = await sealData(sessionData, {
		password: getSessionSecret(),
		ttl,
	})
	return sessionToken
}

export async function getDefaultSessionToken(): Promise<string> {
	const token = await getSessionToken({
		username: undefined,
		userRole: undefined,
	})
	return token
}

