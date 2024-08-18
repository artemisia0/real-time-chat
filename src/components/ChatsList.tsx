import type PropsWithSessionData from '@/types/PropsWithSessionData'
import activeChatIDAtom from '@/jotaiAtoms/activeChatIDAtom'
import { useAtom } from 'jotai'
import PlusIcon from '@/components/PlusIcon'


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

	const onCreateChat = () => {
		if (document) {
			const validDocument = document as any
			validDocument.getElementById("create-chat-modal").showModal()
		}
	}

	return (
		<ul className="menu">
			{sessionData?.username &&
				<li>
					<a className="flex items-center gap-2" onClick={onCreateChat}>
						<PlusIcon />
						<span className="font-bold">
							Create chat
						</span>
					</a>
				</li>
			}
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

