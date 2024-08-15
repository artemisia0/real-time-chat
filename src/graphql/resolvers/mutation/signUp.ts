import type UserCredentialsType from '@/types/UserCredentialsType'
import type StatusType from '@/types/StatusType'


interface ArgsType {
	userCredentials: UserCredentialsType;
}

export default async function signUp(_: any, args: ArgsType, context: object): Promise<StatusType> {
	return {
		ok: true,
		message: "Successfully signed up.",
	}
}

