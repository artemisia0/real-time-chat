import type PropsWithSessionData from '@/types/PropsWithSessionData'
import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
import SuccessIcon from '@/components/SuccessIcon'
import ErrorIcon from '@/components/ErrorIcon'
import activeChatIDAtom from '@/jotaiAtoms/activeChatIDAtom'
import { useSetAtom } from 'jotai'


const createChatMutation = gql`
mutation CreateChat($name: String!, $creatorUsername: String!) {
	createChat(name: $name, creatorUsername: $creatorUsername) {
		status {
			ok
			message
		}
		chat {
			_id
		}
	}
}
`

export default function CreateChatModal({ sessionData }: PropsWithSessionData) {
	const [createChat, createChatResponse] = useMutation(createChatMutation)
	const [chatNameValue, setChatNameValue] = useState('')
	const setActiveChatID = useSetAtom(activeChatIDAtom)

	const onChatNameValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChatNameValue(event.target.value)
	}

	const onCreateChat = () => {
		if (!sessionData?.username) {
			return;
		}

		createChat({
			variables: {
				name: chatNameValue,
				creatorUsername: sessionData.username!,
			}
		}).then(
				(res) => {
					if (res?.data?.createChat?.status?.ok && res?.data?.createChat?.chat?._id) {
						setActiveChatID(res.data.createChat.chat._id)
					}
					if (document) {
						const validDocument = document as any
						validDocument.getElementById('close-create-chat-modal-button').click()
					}
				}
			)
	}

	return (
		<div>
			<dialog id="create-chat-modal" className="modal">
				<div className="modal-box">
					<div className="flex flex-col gap-4">
						<label className="input input-bordered flex items-center gap-2">
							<input disabled={createChatResponse.loading} type="text" className="grow" placeholder="Chat name" value={chatNameValue} onChange={onChatNameValueChange} />
						</label>
						{createChatResponse.error &&
							<div role="alert" className="alert alert-error">
								<ErrorIcon />
								<span>{createChatResponse.error.message ?? ''}</span>
							</div>
						}
						{createChatResponse.data?.createChat?.message &&
							<div role="alert" className={"alert " + (createChatResponse.data?.createChat?.ok ? 'alert-success' : 'alert-error')}>
								{createChatResponse.data?.createChat?.ok
									? <SuccessIcon />
									: <ErrorIcon />
								}
								{createChatResponse.data?.createChat?.message}
							</div>
						}
					</div>
					<div className="modal-action">
						<form method="dialog">
							<button className="btn btn-secondary btn-ghost" id='close-create-chat-modal-button'>
								Close
							</button>
						</form>
						<button className="btn btn-primary flex gap-2 items-center" onClick={onCreateChat} disabled={createChatResponse.loading}>
							<span>
								Create chat
							</span>
							{createChatResponse.loading &&
								<span className="loading loading-spinner" />
							}
						</button>
					</div>
				</div>
			</dialog>
		</div>
	)
}

