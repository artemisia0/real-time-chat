import type PropsWithSessionData from '@/types/PropsWithSessionData'
import activeChatIDAtom from '@/jotaiAtoms/activeChatIDAtom'
import { useAtom } from 'jotai'


export default function ChatsList({ sessionData }: PropsWithSessionData) {
	const [activeChatID, setActiveChatID] = useAtom(activeChatIDAtom)

	const chats = [
		{
			name: 'First chat',
			ID: '234329jgklsJKL',
		},
		{
			name: 'Second chat',
			ID: 'ajKLFJ9234',
		},
	]

	return (
		<ul className="menu">
			{
				chats.map(
					(chat, index) => (
						<li key={index}>
							<a onClick={() => setActiveChatID(chat.ID)}>
								<span className={activeChatID === chat.ID ? 'text-success font-bold' : ''}>
									{ chat.name }
								</span>
							</a>
						</li>
					)
				)
			}
		</ul>
	)
}

