'use client'

import { useState } from 'react'
import { signIn } from '@/actions/auth'
import { useRouter } from 'next/navigation'


export default function SignInForm() {
	const [statusSuccess, setStatusSuccess] = useState(true)
	const [statusMessage, setStatusMessage] = useState('')
	const [isProcessing, setIsProcessing] = useState(false)
	const router = useRouter()

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formElement = event.target as HTMLFormElement
		const formData = new FormData(formElement)
		const username = formData.get('username') as string
		const password = formData.get('password') as string

		setIsProcessing(true)
		signIn(username, password)
			.then(status => {
				setStatusSuccess(status.statusSuccess)
				setStatusMessage(status.statusMessage)
				setIsProcessing(false)
				if (status.statusSuccess) {
					router.push('/')
				}
			})
	}

	return (
		<form className="flex flex-col text-white font-bold" onSubmit={onSubmit}>
			<input className="bg-gray-900" type="text" name="username" placeholder="Username" disabled={isProcessing} />
			<input className="bg-gray-900" type="password" name="password" placeholder="Password" disabled={isProcessing} />
			{statusSuccess == false && statusMessage.length != 0 &&
				<div className="text-sm">
					{statusMessage}
				</div>
			}
			<button type="submit" className="bg-cyan-500" disabled={isProcessing}>
				Sign in 
			</button>
		</form>
	)
}

