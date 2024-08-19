'use client'

import { useState, createElement } from 'react'
import type PropsWithSessionData from '@/types/PropsWithSessionData'
import ThemeControllerMenuItem from '@/components/ThemeControllerMenuItem'


function SignOutIcon() {
	return (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
</svg>
	)
}

function SignInIcon() {
	return (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
</svg>
	)
}

function SignUpIcon() {
	return (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
</svg>
	)
}

function SignIn() {
	const onSignIn = () => {
		if (document != null) {
			const validDocument = document as any
			validDocument.getElementById('sign-in-modal').showModal()
		}
	}

	return (
		<a onClick={onSignIn} className="flex items-center gap-2">
			<SignInIcon />
			<span>
				Sign In
			</span>
		</a>
	)
}

function SignUp() {
	const onSignUp = () => {
		if (document != null) {
			const validDocument = document as any
			validDocument.getElementById('sign-up-modal').showModal()
		}
	}

	return (
		<a onClick={onSignUp} className="flex items-center gap-2">
			<SignUpIcon />
			<span>
				Sign Up
			</span>
		</a>
	)
}

export default function MyProfile({ sessionData }: PropsWithSessionData) {
	const [isCollapseOpened, setIsCollapseOpened] = useState(false)
	
	const onSignOut = () => {
		if (document != null) {
			const validDocument = document as any
			validDocument.getElementById('sign-out-modal').showModal()
		}
	}

	const signedIn = sessionData.username != null
	const username = sessionData.username ?? ''

	const profileActions = []
	profileActions.push({
		label: 'Sign Out',
		icon: SignOutIcon,
		onClick: onSignOut,
	})

	let collapseClassName = 'collapse collapse-plus'
	if (isCollapseOpened) {
		collapseClassName += ' ' + 'collapse-open'
	}

	if (!signedIn) {
		return (
			<ul className="menu">
				<li>
					<SignIn />
				</li>
				<li>
					<SignUp />
				</li>
			</ul>
		)
	}

	return (
		<div className="flex flex-col">
			<div className="avatar" onClick={() => setIsCollapseOpened(!isCollapseOpened)}>
				<div className="rounded">
					<img src="/myprofile.jpg" alt="My profile image" />
				</div>
			</div>
			<div className={collapseClassName}>
				<div className="collapse-title" onClick={() => setIsCollapseOpened(!isCollapseOpened)}>
					{username}
				</div>
				<div className="collapse-content p-0">
					<ul className="menu">
						<ThemeControllerMenuItem />
						{profileActions.map(
							(action, index) => (
								<li key={index}>
									<a onClick={action.onClick} className="flex items-center gap-2">
										{createElement(action.icon)}
										<span>
											{action.label}
										</span>
									</a>
								</li>
							)
						)}
					</ul>
				</div>
			</div>
		</div>
	)
}

