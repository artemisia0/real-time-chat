export default function sessionToPlainObject(session: { [key: string]: any; }) {
	return {
		username: session.username,
		userID: session.userID,
	}
}

