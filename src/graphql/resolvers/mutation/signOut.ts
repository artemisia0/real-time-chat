import type StatusType from '@/types/StatusType'


export default async function signIn(_1: any, _2: any, context: object): Promise<StatusType> {
	return {
		ok: true,
		message: "Successfully signed out.",
	}
}

