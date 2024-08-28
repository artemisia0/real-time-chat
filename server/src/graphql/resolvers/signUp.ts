import type UserCredentialsType from '../../types/UserCredentialsType'
import type StatusType from '../../types/StatusType'
import bcrypt from 'bcrypt'
import User from '../../mongooseModels/User'


interface ArgsType {
	userCredentials: UserCredentialsType;
}

export default async function signUp(_: any, args: ArgsType): Promise<StatusType> {
	const { username, password } = args.userCredentials
	const possiblyFoundUser = await User.findOne({ username })
	if (possiblyFoundUser != null) {
		return {
			ok: false,
			message: 'Such user already exists.',
		}
	}
	const saltRounds = process.env.BCRYPT_SALT_ROUNDS
	if (!saltRounds) {
		console.error('BCRYPT_SALT_ROUNDS is not set.')
		process.exit(1)
	}
	const hashedPassword = await bcrypt.hash(password, Number.parseFloat(saltRounds!))
	const newUser = new User({ username, hashedPassword })
	await newUser.save()
	return {
		ok: true,
		message: "Successfully signed up.",
	}
}

