'use client'

import SignInModal from '@/components/SignInModal'
import SignUpModal from '@/components/SignUpModal'
import SignOutModal from '@/components/SignOutModal'
import type SessionData from '@/types/SessionData'
import { ApolloProvider } from '@apollo/client'
import createGqlClient from '@/graphql/createGqlClient'
import ChatsList from '@/components/ChatsList'
import ChatDashboard from '@/components/ChatDashboard'
import CreateChatModal from '@/components/CreateChatModal'
import RenameChatModal from '@/components/RenameChatModal'
import SignInMenuItem from '@/components/SignInMenuItem'
import SignUpMenuItem from '@/components/SignUpMenuItem'
import { useEffect, useState } from 'react'


export default function RootPage({ sessionData, defaultSessionToken }: { sessionData: SessionData; defaultSessionToken: string; }) {
	const [sessionToken, setSessionToken] = useState<string | undefined>(undefined)

	useEffect(
		() => {
			if (window?.localStorage) {
				setSessionToken(localStorage.getItem('sessionToken')!)
			}
		}, [localStorage]
	)

	const gqlClient = createGqlClient(sessionToken ?? defaultSessionToken)
	if (sessionData.username == null) {
		return (
			<ApolloProvider client={gqlClient}>
				<div className="flex justify-center items-center h-dvh text-xl">
					<div className="flex flex-col justify-center items-center gap-8">
						<h2 className="font-bold text-2xl">
							Real-time chat
						</h2>
						<ul className="menu p-2 w-52 shadow bg-base-200">
							<SignInMenuItem />
							<SignUpMenuItem />
							<SignInModal />
							<SignUpModal />
						</ul>
					</div>
				</div>
			</ApolloProvider>
		)
	}

	return (
		<ApolloProvider client={gqlClient}>
			<div className="drawer sm:drawer-open">
				<input id="main-drawer" type="checkbox" className="drawer-toggle" />
				<div className="drawer-content p-2 h-dvh">
					<label htmlFor="main-drawer" className="btn btn-md btn-circle sm:hidden absolute left-4 bottom-4 z-[5]">
						<BurgerMenuIcon />
					</label>
					{ sessionData?.username &&
						<ChatDashboard sessionData={sessionData} />
					}
					<SignOutModal />
					{sessionData?.username &&
						<>
							<CreateChatModal sessionData={sessionData} />
							<RenameChatModal sessionData={sessionData} />
						</>
					}
				</div>
				<div className="drawer-side min-h-screen">
					<label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
					<div className="bg-base-200 text-base-content min-h-full w-64 p-2">
						{ sessionData?.username &&
							<ChatsList sessionData={sessionData} />
						}
					</div>
				</div>
			</div>
		</ApolloProvider>
	)
}

function BurgerMenuIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
			<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
		</svg>
	)
}

