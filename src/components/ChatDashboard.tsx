import { useAtomValue, useAtom } from 'jotai'
import activeChatIDAtom from '@/jotaiAtoms/activeChatIDAtom'
import type PropsWithSessionData from '@/types/PropsWithSessionData'
import SendIcon from '@/components/SendIcon'
import AttachIcon from '@/components/AttachIcon'
import SettingsIcon from '@/components/SettingsIcon'
import { useState, useRef, useEffect } from 'react'
import userChatsAtom from '@/jotaiAtoms/userChatsAtom'
import { useMutation, useQuery, gql } from '@apollo/client'
import EditIcon from '@/components/EditIcon'
import activeChatMessagesAtom from '@/jotaiAtoms/activeChatMessagesAtom'
import { format } from 'date-fns'


const leaveChatMutation = gql`
mutation LeaveChat($username: String!, $chatID: String!) {
	leaveChat(username: $username, chatID: $chatID) {
		ok
		message
	}
}
`

const messagesQuery = gql`
query Messages($chatID: String!) {
	messages(chatID: $chatID) {
		contents
		authorUsername
		date
	}
}
`

const createMessageMutation = gql`
mutation CreateMessage($chatID: String!, $authorUsername: String!, $contents: String!, $date: DateTime!) {
	createMessage(chatID: $chatID, authorUsername: $authorUsername, contents: $contents, date: $date) {
		ok
		message
	}
}
`

function LeaveIcon() {
	return (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
</svg>
	)
}

export default function ChatDashboard({ sessionData }: PropsWithSessionData) {
	const [activeChatID, setActiveChatID] = useAtom(activeChatIDAtom)
	const [settingsDropdownOpened, setSettingsDropdownOpened] = useState(false)
	const [userChats, setUserChats] = useAtom(userChatsAtom)
	const [leaveChat, leaveChatResponse] = useMutation(leaveChatMutation)
	const settingsDropdownRef = useRef<any>(undefined)
	const messagesQueryResponse = useQuery(messagesQuery, {
		variables: {
			chatID: activeChatID,
		}
	})
	const messageInputRef = useRef<any>(undefined)
	const [activeChatMessages, setActiveChatMessages] = useAtom(activeChatMessagesAtom)
	const [createMessage, createMessageResponse] = useMutation(createMessageMutation)
	const lastMessageRef = useRef<any>(undefined)

	useEffect(
		() => {
			if (lastMessageRef.current) {
				lastMessageRef.current.scrollIntoView({ behaviour: 'smooth', block: 'center' })
			}
		}, [activeChatMessages]
	)


	useEffect(
		() => {
			const doAsyncWork = async () => {
				if (messagesQueryResponse.data?.messages) {
					setActiveChatMessages(messagesQueryResponse.data.messages!)
				}
			}
			doAsyncWork()
		}, [messagesQueryResponse.data?.messages, setActiveChatMessages]
	)

	const onSendMessage = () => {
		const messageContents = messageInputRef.current?.value
		if (messageContents && activeChatID && sessionData.username) {
			// add message to activeChatMessages as a loading one (or processing one)
			const newMessages = [...(activeChatMessages!)]
			const newMessageData = {
				chatID: activeChatID,
				authorUsername: sessionData.username! as string,
				contents: messageContents! as string,
				date: new Date(),
				loading: true,
			}
			messageInputRef.current.value = ''
			newMessages.push(newMessageData)
			setActiveChatMessages(newMessages)

			const onCreateMessageError = (errMsg: string) => {
				for (let messageIndex = 0; messageIndex < newMessages.length; messageIndex += 1) {
					if (newMessages[messageIndex] === newMessageData) {
						const msgs = [...newMessages]
						msgs[messageIndex].loading = false
						msgs[messageIndex].errorMessage = errMsg
						setActiveChatMessages(msgs)
						break;
					}
				}
			}

			// API call
			createMessage({
				variables: {
					chatID: newMessageData.chatID!,
					authorUsername: newMessageData.authorUsername!,
					contents: newMessageData.contents!,
					date: newMessageData.date!,
				}
			}).then(
					(res) => {
						if (res.data.createMessage.ok) {
							// make loading message to be displayed as already sended one
							for (let messageIndex = 0; messageIndex < newMessages.length; messageIndex += 1) {
								if (newMessages[messageIndex] === newMessageData) {
									const msgs = [...newMessages]
									msgs[messageIndex].loading = false
									setActiveChatMessages(msgs)
									break;
								}
							}
						} else if (res.data.createMessage.message) {
							// make loading message to be displayed as a bad one
							// and display res.createMessage.message as an error description
							onCreateMessageError(res.data.createMessage.message)
						}
					},
					(err) => onCreateMessageError(err.toString())
				)
		}
	}

	const onSettingsClick = () => {
		setSettingsDropdownOpened(!settingsDropdownOpened)
		if (settingsDropdownRef?.current) {
			settingsDropdownRef.current.blur()
		}
	}

	const onRenameChat = () => {
		if (document) {
			const validDocument = document as any
			validDocument.getElementById('rename-chat-modal').showModal()
		}
	}

	const onLeaveChat = () => {
		onSettingsClick()
		if (!sessionData?.username || !activeChatID || !userChats) {
			return;
		}
		const filteredUserChats = userChats.filter((chat) => chat._id !== activeChatID)
		setUserChats(filteredUserChats)
		leaveChat({
			variables: {
				username: sessionData.username!,
				chatID: activeChatID!,
			}
		})
		if (filteredUserChats[0]?._id) {
			setActiveChatID(filteredUserChats[0]._id!)
		}
	}

	if (!activeChatID) {
		return (
			<div />
		)
	}
	
	let activeChatName = ''
	if (userChats) {
		for (let { _id, name } of userChats!) {
			if (_id === activeChatID) {
				activeChatName = name
			}
		}
	}

	return (
		<div className="flex flex-col items-center justify-between gap-4 w-full h-full">
			<div className="p-4 overflow-y-scroll overflow-x-hidden max-h-max max-w-[720px] w-full flex flex-col gap-2">
				{ activeChatMessages &&
					activeChatMessages.map(
						(msg: { loading?: boolean; errorMessage?: string; contents: string; authorUsername: string; date: Date; }, index: number) => (
							<div key={index} className={"flex flex-col gap-2 chat" + (msg.authorUsername === sessionData?.username ? ' chat-end' : ' chat-start')} ref={index === activeChatMessages.length-1 ? lastMessageRef : undefined}>
								<div className="flex justify-between text-sm">
									<span>
										{msg.authorUsername !== sessionData.username
											? msg.authorUsername
											: ''
										}
									</span>
									<span>
										{format(msg.date, 'hh:mm:ss yyyy/MM/dd')}
									</span>
								</div>
								<div className="chat-bubble flex flex-col justify-center gap-2">
									<span className="break-words">
										{msg.contents}
									</span>
									{msg.errorMessage &&
										<span className="text-error font-bold">
											{msg.errorMessage}
										</span>
									}
									{msg.loading &&
										<span className="loading loading-dots" />
									}
								</div>
							</div>
						)
					)
				}
			</div>
			<div className="flex flex-col w-full gap-2 max-w-[720px]">
				<div className="flex w-full bg-neutral gap-2 p-2 items-center">
					<input className="input input-bordered w-full" type="text" placeholder="Message" ref={messageInputRef} />
					<button className="btn btn-primary btn-square" onClick={onSendMessage}>
						<SendIcon />
					</button>
					<button className="btn btn-primary btn-square">
						<AttachIcon />
					</button>
				</div>
				<div className="flex w-full bg-neutral p-2 items-center">
					<span className="flex flex-grow justify-center font-bold">
						{activeChatName}
					</span>
					<div tabIndex={0} className={"dropdown dropdown-top dropdown-end" + (settingsDropdownOpened ? '  dropdown-opened' : ' ')}>
						<button className={"btn btn-primary btn-square"} onClick={onSettingsClick}>
							<SettingsIcon />
						</button>
						<ul ref={settingsDropdownRef} tabIndex={0} className="dropdown-content menu bg-base-200 w-64 p-2 shadow">
							<li>
								<a className="flex items-center gap-2" onClick={onRenameChat}>
									<EditIcon />
									<span className="font-bold">
										Rename chat
									</span>
								</a>
							</li>
							<li>
								<a className="flex items-center gap-2 text-error" onClick={onLeaveChat}>
									<LeaveIcon />
									<span className="font-bold">
										Leave chat
									</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

