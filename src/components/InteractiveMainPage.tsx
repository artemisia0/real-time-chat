'use client'

import MainPageSidebar from '@/components/MainPageSidebar'
import Chat from '@/components/Chat'


export default function InteractiveMainPage({ session }: { session: { [key: string]: any; } }) {
	return (
		<main className="flex">
			<MainPageSidebar session={session} />
			<Chat session={session} />
		</main>
	)
}

