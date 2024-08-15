import type StatusType from '@/types/StatusType'
import { getSessionData, deleteSession } from '@/actions/session'


export default async function signIn(): Promise<StatusType> {
	const sessionData = await getSessionData()
	if (sessionData?.username == null) {
		return {
			ok: false,
			message: "Already signed out.",
		}
	}
	await deleteSession()
	return {
		ok: true,
		message: "Successfully signed out.",
	}
}

