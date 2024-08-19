import type PropsWithSessionData from '@/types/PropsWithSessionData'
import activeChatIDAtom from '@/jotaiAtoms/activeChatIDAtom'
import { useAtom } from 'jotai'
import PlusIcon from '@/components/PlusIcon'
import { gql, useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import userChatsAtom from '@/jotaiAtoms/userChatsAtom'


const chatsQuery = gql`
query Chats($username: String!) {
	chats(username: $username) {
		_id
		name
	}
}
`

export default function ChatsList({ sessionData }: PropsWithSessionData) {
	const [activeChatID, setActiveChatID] = useAtom(activeChatIDAtom)
	const [userChats, setUserChats] = useAtom(userChatsAtom)
	const chatsQueryResponse = useQuery(chatsQuery, {
		variables: {
			username: sessionData?.username!,
		}
	})

	useEffect(
		() => {
			const doAsyncStuff = async () => {
				if (chatsQueryResponse?.data?.chats) {
					setUserChats(chatsQueryResponse?.data?.chats!)
				}
			}
			doAsyncStuff()
		}, [chatsQueryResponse?.data?.chats, setUserChats]
	)

	const onCreateChat = () => {
		if (document) {
			const validDocument = document as any
			validDocument.getElementById("create-chat-modal").showModal()
		}
	}

	if (chatsQueryResponse.loading) {
		return (
			<div className="flex justify-center items-center">
				<span className="loading loading-dots" />
			</div>
		)
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
			{chatsQueryResponse.error &&
				chatsQueryResponse.error.graphQLErrors.map(
					({ message }, i) => (
						<li key={i}>
							<a className="text-error">
								{message}
							</a>
						</li>
					)
				)
			}
			{userChats != null && userChats.map(
					(chat: { _id: string; name: string; }, index: number) => (
						<li key={index}>
							<a onClick={() => setActiveChatID(chat._id)}>
								<span className={activeChatID === chat._id ? 'text-success font-bold' : ''}>
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

