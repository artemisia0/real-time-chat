'use client'

import MyProfile from '@/components/MyProfile'
import SignInModal from '@/components/SignInModal'
import SignUpModal from '@/components/SignUpModal'
import SignOutModal from '@/components/SignOutModal'
import type PropsWithSessionData from '@/types/PropsWithSessionData'
import { ApolloProvider } from '@apollo/client'
import gqlClient from '@/graphql/gqlClient'
import ChatsList from '@/components/ChatsList'
import ChatDashboard from '@/components/ChatDashboard'
import CreateChatModal from '@/components/CreateChatModal'
import RenameChatModal from '@/components/RenameChatModal'


export default function RootPage({ sessionData }: PropsWithSessionData) {
	return (
		<ApolloProvider client={gqlClient}>
			<div className="drawer sm:drawer-open">
				<input id="main-drawer" type="checkbox" className="drawer-toggle" />
				<div className="drawer-content p-2 h-dvh">
					<label htmlFor="main-drawer" className="btn btn-md btn-circle sm:hidden absolute left-4 top-4 z-60">
						<BurgerMenuIcon />
					</label>
					{ sessionData?.username &&
						<ChatDashboard sessionData={sessionData} />
					}
					<SignInModal />
					<SignUpModal />
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
						<MyProfile sessionData={sessionData} />
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

