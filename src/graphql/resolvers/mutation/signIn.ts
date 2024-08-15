import type UserCredentialsType from '@/types/UserCredentialsType'
import type StatusType from '@/types/StatusType'
import bcrypt from 'bcrypt'
import User from '@/mongooseModels/User'
import { createSession } from '@/actions/session'


interface ArgsType {
	userCredentials: UserCredentialsType;
}

export default async function signIn(_: any, args: ArgsType): Promise<StatusType> {
	const { password, username } = args.userCredentials
	const foundUser = await User.findOne({ username })
	if (!foundUser) {
		return {
			ok: false,
			message: "Invalid username.",
		}
	}
	if (!(await bcrypt.compare(password, foundUser.hashedPassword ?? ""))) {
		return {
			ok: false,
			message: "Invalid password.",
		}
	}
	await createSession({
		username,
		userRole: 'user',
	})
	return {
		ok: true,
		message: "Successfully signed in.",
	}
}

