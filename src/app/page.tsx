import RootPage from '@/components/RootPage'
import { getDefaultSessionToken } from '@/actions/session'
import type SessionData from '@/types/SessionData'


export default async function Page() {
	const defaultSessionToken = await getDefaultSessionToken()

	return (
		<RootPage defaultSessionToken={defaultSessionToken} />
	)
}

