import { getIronSession } from 'iron-session'
import type SessionData from '@/types/SessionData'
import { cookies } from 'next/headers'


export async function getSessionData(): Promise<SessionData> {
	const session = await getSession()
	return JSON.parse(JSON.stringify(session))
}

export async function getSession() {
	if (!process.env.IRON_SESSION_PASSWORD) {
		console.error('IRON_SESSION_PASSWORD is not set.')
		process.exit(1)
	}
	if (!process.env.IRON_SESSION_COOKIE_NAME) {
		console.error('IRON_SESSION_COOKIE_NAME is not set.')
		process.exit(1)
	}
	const session = await getIronSession(cookies(), {
		password: process.env.IRON_SESSION_PASSWORD!,
		cookieName: process.env.IRON_SESSION_COOKIE_NAME!,
	})
	return session
}

export async function createSession(sessionData: SessionData) {
	const session = await getSession() as any
	Object.assign(session, sessionData)
	await session.save()
}

export async function deleteSession() {
	const session = await getSession()
	session.destroy()
}

