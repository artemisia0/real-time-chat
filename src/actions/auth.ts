'use server'

const bcrypt = require('bcrypt')
import { userExistsByUsername, fetchUserDataByUsername, createUser } from '@/actions/user'
import { createSession, deleteSession } from '@/actions/session'


export async function signUp(username: string, password: string) {
	if (username.length < 8) {
		return {
			statusSuccess: false,
			statusMessage: "Username must be at least 8 characters long.",
		}
	}
	if (username.length > 32) {
		return {
			statusSuccess: false,
			statusMessage: "Username must be at most 32 characters long."
		}
	}
	if (password.length < 8) {
		return {
			statusSuccess: false,
			statusMessage: "Password must be at least 8 characters long.",
		}
	}
	if (password.length > 32) {
		return {
			statusSuccess: false,
			statusMessage: "Password must be at most 32 characters long."
		}
	}

	if (await userExistsByUsername(username)) {
		return {
			statusSuccess: false,
			statusMessage: "User with such a username already exists."
		}
	}

	const hashedPassword = await bcrypt.hash(password, 10)

	await createUser(username, hashedPassword)

	return {
		statusSuccess: true,
		statusMessage: 'Successfully signed up.',
	}
}

export async function signIn(username: string, password: string) {
	const suchUserExists = await userExistsByUsername(username)
	if (!suchUserExists) {
		return {
			statusSuccess: false,
			statusMessage: "User with provided name does not exist."
		}
	}

	const hashedPasswordFromDB = (await fetchUserDataByUsername(username)).hashedPassword ?? ""
	if ((await bcrypt.compare(password, hashedPasswordFromDB)) == false) {
		return {
			statusSuccess: false,
			statusMessage: "Invalid password."
		}
	}

	await createSession(username)

	return {
		statusSuccess: true,
		statusMessage: 'Successfuly signed in.',
	}
}

export async function signOut() {
	await deleteSession()

	return {
		statusSuccess: true,
		statusMessage: 'Successfully signed out.',
	}
}

