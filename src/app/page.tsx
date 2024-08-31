import RootPage from '@/components/RootPage'
import { getSessionData, getDefaultSessionToken } from '@/actions/session'
import { headers } from 'next/headers'
import type SessionData from '@/types/SessionData'


export default async function Page() {
	let sessionData: SessionData = {
		username: undefined,
		userRole: undefined,
	}
	const sessionToken = headers().get('authorization')
	if (sessionToken) {
		sessionData = await getSessionData(sessionToken!)
	}
	const defaultSessionToken = await getDefaultSessionToken()

	return (
		<RootPage sessionData={sessionData} defaultSessionToken={defaultSessionToken} />
	)
}

