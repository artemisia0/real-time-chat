'use client'

import { useState } from 'react'
import { saveMessageToDB } from '@/actions/chat'


export default function MessageInput({chatID, authorID}: { chatID: number; authorID: number; }) {
	const [inputValue, setInputValue] = useState('')
	const [isProcessing, setIsProcessing] = useState(false)

	const onInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
	}

	const sendCallback = () => {
		setIsProcessing(true)
		saveMessageToDB({ chatID, authorID, contents: inputValue })
			.then(() => setIsProcessing(false))
		setInputValue('')
	}

	return (
		<div className="flex border border-gray-900 rounded-sm bg-amber-600">
			<input className="bg-cyan-900 text-white font-bold" disabled={isProcessing} value={inputValue} onChange={onInputValueChange} />
			<button disabled={isProcessing} className="text-white font-bold bg-cyan-600 rounded-sm border border-gray-900" onClick={sendCallback}>
				{isProcessing ? "Processing" : "Send"}
			</button>
		</div>
	)
}

