'use client'

import { useAtom } from 'jotai'
import activeChatIDAtom from '@/lib/activeChatIDAtom'
import CreateChatDashboard from '@/components/CreateChatDashboard'
import UserProfile from '@/components/UserProfile'
import SignUpForm from '@/components/SignUpForm'
import SignInForm from '@/components/SignInForm'
import SignOutForm from '@/components/SignOutForm'
import { useEffect, useState } from 'react'
import { fetchChatsUserBelongsTo } from '@/actions/chat'


export default function MainPageSidebar({ session }: { session: { [key: string]: any; } }) {
	const [activeChatID, setActiveChatID] = useAtom(activeChatIDAtom)
	const [userChats, setUserChats] = useState<{ name: string; ID: number; }[]>([])

	useEffect(
		() => {
			const fetchData = async () => {
				const fetchedChats = await fetchChatsUserBelongsTo(session.userID!)
				if (fetchedChats.statusSuccess) {
					setUserChats(fetchedChats.data)
				}
			}

			if (session?.userID != null) {
				fetchData()
			}
		}, [session]
	)

	return (
		<div className="flex flex-col p-3 m-3 rounded-sm border border-gray-500 bg-gray-900 shadow">
			<UserProfile session={session} />
			<SignUpForm />
			<SignInForm />
			<SignOutForm />
			<CreateChatDashboard session={session} />
			{userChats.map(
				(chat) => (
					<button key={chat.ID} className="bg-cyan-500 rounded-sm p-3 border border-gray-900" onClick={() => setActiveChatID(chat.ID)}>
						{chat.name}
					</button>
				)
			)}
		</div>
	)
}

