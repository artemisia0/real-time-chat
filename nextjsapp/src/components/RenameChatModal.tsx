import type PropsWithSessionData from '@/types/PropsWithSessionData'
import { gql, useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import SuccessIcon from '@/components/SuccessIcon'
import ErrorIcon from '@/components/ErrorIcon'
import activeChatIDAtom from '@/jotaiAtoms/activeChatIDAtom'
import { useAtomValue, useAtom } from 'jotai'
import userChatsAtom from '@/jotaiAtoms/userChatsAtom'


const renameChatMutation = gql`
mutation RenameChat($chatID: String!, $name: String!) {
	renameChat(chatID: $chatID, name: $name) {
		ok
		message
	}
}
`

export default function RenameChatModal({ sessionData }: PropsWithSessionData) {
	const [renameChat, renameChatResponse] = useMutation(renameChatMutation)
	const activeChatID = useAtomValue(activeChatIDAtom)
	const [userChats, setUserChats] = useAtom(userChatsAtom)
	const [chatNameValue, setChatNameValue] = useState('')

	useEffect(
		() => {
			const doAsyncWork = async () => {
				if (!userChats || !activeChatID) {
					return;
				}
				let activeChatName = ''
				for (let { _id, name } of userChats!) {
					if (_id === activeChatID!) {
						setChatNameValue(name)
					}
				}
			}
		}, [activeChatID, userChats]
	)

	const onChatNameValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChatNameValue(event.target.value)
	}

	const onRenameChat = () => {
		if (!sessionData?.username || !activeChatID) {
			return;
		}

		const updateUserChatsState = () => {
			if (!userChats || !activeChatID) {
				return;
			}
			const chats = userChats.map(
				(chat) => {
					if (chat._id === activeChatID) {
						return {
							name: chatNameValue,
							_id: chat._id,
						}
					}
					return chat
				}
			)
			setUserChats(chats)
		}
		updateUserChatsState()

		renameChat({
			variables: {
				name: chatNameValue,
				chatID: activeChatID!,
			}
		}).then(
				(res) => {
					if (document && res.data?.renameChat?.ok) {
						const validDocument = document as any
						validDocument.getElementById('close-rename-chat-modal-button').click()
					}
				}
			)
		setChatNameValue('')
	}

	return (
		<div>
			<dialog id="rename-chat-modal" className="modal">
				<div className="modal-box">
					<div className="flex flex-col gap-4">
						<label className="input input-bordered flex items-center gap-2">
							<input disabled={renameChatResponse.loading} type="text" className="grow" placeholder="Chat name" value={chatNameValue} onChange={onChatNameValueChange} />
						</label>
						{renameChatResponse.error &&
							<div role="alert" className="alert alert-error">
								<ErrorIcon />
								<span>{renameChatResponse.error.message ?? ''}</span>
							</div>
						}
						{renameChatResponse.data?.renameChat?.message &&
							<div role="alert" className={"alert " + (renameChatResponse.data?.renameChat?.ok ? 'alert-success' : 'alert-error')}>
								{renameChatResponse.data?.renameChat?.ok
									? <SuccessIcon />
									: <ErrorIcon />
								}
								{renameChatResponse.data?.renameChat?.message}
							</div>
						}
					</div>
					<div className="modal-action">
						<form method="dialog">
							<button className="btn btn-secondary btn-ghost" id='close-rename-chat-modal-button'>
								Close
							</button>
						</form>
						<button className="btn btn-primary flex gap-2 items-center" onClick={onRenameChat} disabled={renameChatResponse.loading}>
							<span>
								Rename chat
							</span>
							{renameChatResponse.loading &&
								<span className="loading loading-spinner" />
							}
						</button>
					</div>
				</div>
			</dialog>
		</div>
	)
}

