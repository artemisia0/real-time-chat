'use server'

import { fetchUserDataByUsername } from '@/actions/user'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'


export async function getSession() {
	const fromEnv = {
		password: process.env.IRON_SESSION_PASSWORD ?? "",
		cookieName: process.env.IRON_SESSION_COOKIE_NAME ?? "",
	}
	if (fromEnv.password.length == 0) {
		console.error('IRON_SESSION_PASSWORD (env variable) is not set.')
	}
	if (fromEnv.cookieName.length == 0) {
		console.error('IRON_SESSION_COOKIE_NAME (env variable) is not set.')
	}
	const session = await getIronSession<{[key: string]: any;}>(cookies() as any, {
		...fromEnv
	})
	return session
}

export async function createSession(username: string) {
	const session = await getSession()
	const userData = await fetchUserDataByUsername(username)
	session.userID = userData.userID
	session.username = userData.username
	await session.save()
}

export async function deleteSession() {
	const session = await getSession()
	session.destroy()
}

