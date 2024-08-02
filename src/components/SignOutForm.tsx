'use client'

import { useState } from 'react'
import { signOut } from '@/actions/auth'
import { useRouter } from 'next/navigation'


export default function SignInForm() {
	const [statusSuccess, setStatusSuccess] = useState(true)
	const [statusMessage, setStatusMessage] = useState('')
	const [isProcessing, setIsProcessing] = useState(false)
	const router = useRouter()

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsProcessing(true)
		signOut()
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
			{statusSuccess == false && statusMessage.length != 0 &&
				<div className="text-sm">
					{statusMessage}
				</div>
			}
			<button type="submit" className="bg-cyan-500" disabled={isProcessing}>
				Sign out
			</button>
		</form>
	)
}

