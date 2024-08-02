'use client'


export default function UserProfile({ session }: { session: { [key: string]: any; } }) {
	if (session.userID == null) {
		return (
			<div className="flex justify-center items-center font-bold text-white">
				Guest user
			</div>
		)
	}

	return (
		<div className="flex flex-col fond-bold text-white">
			<div>
				Username: {session.username ?? "___NO_USERNAME__"}
			</div>
			<div>
				userID: {session.userID ?? -1}
			</div>
		</div>
	)
}

