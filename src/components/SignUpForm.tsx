'use client'

import { useState } from 'react'
import { signUp } from '@/actions/auth'


export default function SignUpForm() {
	const [statusSuccess, setStatusSuccess] = useState(true)
	const [statusMessage, setStatusMessage] = useState('')
	const [isProcessing, setIsProcessing] = useState(false)

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formElement = event.target as HTMLFormElement
		const formData = new FormData(formElement)
		const username = formData.get('username') as string
		const password = formData.get('password') as string
		const passwordCopy = formData.get('passwordCopy') as string
		if (password !== passwordCopy) {
			setStatusSuccess(false)
			setStatusMessage("Password are not the same.")
		} else {
			setIsProcessing(true)
			signUp(username, password)
				.then(status => {
					setStatusSuccess(status.statusSuccess)
					setStatusMessage(status.statusMessage)
					setIsProcessing(false)
				})
		}
}

	return (
		<form className="flex flex-col text-white font-bold" onSubmit={onSubmit}>
			<input className="bg-gray-900" type="text" name="username" placeholder="Username" disabled={isProcessing} />
			<input className="bg-gray-900" type="password" name="password" placeholder="Password" disabled={isProcessing} />
			<input className="bg-gray-900" type="password" name="passwordCopy" placeholder="Previously entered password" disabled={isProcessing} />
			{statusSuccess == false && statusMessage.length != 0 &&
				<div className="text-sm">
					{statusMessage}
				</div>
			}
			<button type="submit" className="bg-cyan-500" disabled={isProcessing}>
				Sign up
			</button>
		</form>
	)
}

