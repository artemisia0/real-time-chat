'use client'

import ChatMessage from '@/components/ChatMessage'
import { useAtomValue } from 'jotai'
import activeChatIDAtom from '@/lib/activeChatIDAtom'
import { fetchMessagesByChatID } from '@/actions/chat'
import { useState, useEffect } from 'react'
import type MsgData from '@/lib/MsgData'
import MessageInput from '@/components/MessageInput'


export default function Chat({ session }: { session: { [key: string]: any; } }) {
	const activeChatID = useAtomValue(activeChatIDAtom)
	const [messages, setMessages] = useState<null | MsgData[]>(null)

	useEffect(
		() => {
			const fetchData = async () => {
				if (activeChatID == null) {
					return
				}
				const result = await fetchMessagesByChatID(activeChatID as number)
				if (result.statusSuccess) {
					setMessages(result.data)
				}
			}
			fetchData()
		},
		[activeChatID]
	)

	if (messages == null || activeChatID == null) {
		return (
			<div className="text-white font-bold text-lg flex items-center align-center justify-center">
				No messages...
			</div>
		)
	}

	return (
		<div className="text-white p-3 m-3 rounded-sm border border-gray-500 bg-gray-900 shadow">
			Chat {activeChatID}
			{messages.map(
				(msg, index) => (
					<ChatMessage key={index} msgData={msg} />
				)
			)}
			<MessageInput chatID={activeChatID} authorID={session.userID} />
		</div>
	)
}

