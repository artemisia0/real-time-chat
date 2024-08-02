'use client'

import { useState } from 'react'
import { createChat } from '@/actions/chat'


export default function CreateChatDashboard({ session }: { session: { [key: string]: any; } }) {
	const [inputValue, setInputValue] = useState('')

	const addChatCallback = () => {
		createChat(inputValue, session.userID)
		setInputValue('')
	}

	const onInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
	}

	return (
		<div className="flex border border-gray-900 rounded-sm">
			<input className="bg-cyan-900 text-white font-bold" value={inputValue} onChange={onInputValueChange} />
			<button className="bg-cyan-600 border border-gray-900 rounded-sm font-bold text-white" onClick={addChatCallback}>
				Add chat
			</button>
		</div>
	)
}

