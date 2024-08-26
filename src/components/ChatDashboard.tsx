import { useAtomValue, useAtom } from 'jotai'
import activeChatIDAtom from '@/jotaiAtoms/activeChatIDAtom'
import type PropsWithSessionData from '@/types/PropsWithSessionData'
import SendIcon from '@/components/SendIcon'
import AttachIcon from '@/components/AttachIcon'
import SettingsIcon from '@/components/SettingsIcon'
import { useState, useRef, useEffect } from 'react'
import userChatsAtom from '@/jotaiAtoms/userChatsAtom'
import { useMutation, useQuery, gql, useSubscription } from '@apollo/client'
import EditIcon from '@/components/EditIcon'
import activeChatMessagesAtom from '@/jotaiAtoms/activeChatMessagesAtom'
import { format } from 'date-fns'
import DeleteIcon from '@/components/DeleteIcon'
import type MessageData from '@/types/MessageData'
import ChatSettingsDashboard from '@/components/ChatSettingsDashboard'
import chatSettingsOpenedAtom from '@/jotaiAtoms/chatSettingsOpenedAtom'
import needsScrollingIntoViewOfLastMessageAtom from '@/jotaiAtoms/needsScrollingIntoViewOfLastMessageAtom'


function CancelIcon() {
	return (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
	)
}

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
		_id
	}
}
`

const createMessageMutation = gql`
mutation CreateMessage($chatID: String!, $authorUsername: String!, $contents: String!, $date: DateTime!) {
	createMessage(chatID: $chatID, authorUsername: $authorUsername, contents: $contents, date: $date) {
		status {
			ok
			message
		}
		newMessage {
			_id
		}
	}
}
`

const editMessageMutation = gql`
mutation EditMessage($messageID: String!, $newMessageContents: String!) {
	editMessage(messageID: $messageID, newMessageContents: $newMessageContents) {
		status {
			ok
			message
		}
	}
}
`

const deleteMessageMutation = gql`
mutation DeleteMessage($messageID: String!) {
	deleteMessage(messageID: $messageID) {
		status {
			ok
			message
		}
	}
}
`

const newMessageSubscription = gql`
subscription NewMessage($chatID: String!) {
	newMessage(chatID: $chatID) {
		authorUsername
		_id
		date
		contents
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
	const [needsScrollingIntoViewOfLastMessage, setNeedsScrollingIntoViewOfLastMessage] = useAtom(needsScrollingIntoViewOfLastMessageAtom)
	const [chatSettingsOpened, setChatSettingsOpened] = useAtom(chatSettingsOpenedAtom)
	const [activeChatID, setActiveChatID] = useAtom(activeChatIDAtom)
	const [userChats, setUserChats] = useAtom(userChatsAtom)
	const [leaveChat, leaveChatResponse] = useMutation(leaveChatMutation)
	const messagesQueryResponse = useQuery(messagesQuery, {
		variables: {
			chatID: activeChatID,
		}
	})
	const messageInputRef = useRef<any>(undefined)
	const [activeChatMessages, setActiveChatMessages] = useAtom(activeChatMessagesAtom)
	const [createMessage, createMessageResponse] = useMutation(createMessageMutation)
	const lastMessageRef = useRef<any>(undefined)
	const [indexOfFocusedMessage, setIndexOfFocusedMessage] = useState<number | undefined>(undefined)
	const [indexOfMessageToEdit, setIndexOfMessageToEdit] = useState<number | undefined>(undefined)
	const [editMessageMutator, editMessageMutatorResponse] = useMutation(editMessageMutation)
	const [deleteMessageMutator, deleteMessageMutatorResponse] = useMutation(deleteMessageMutation)
	const newMessageResponse = useSubscription(newMessageSubscription, {
		variables: {
			chatID: activeChatID!,
		}
	})
	const [lastNewMessageID, setLastNewMessageID] = useState<number | undefined>(undefined)

	useEffect(
		() => {
			const onNewMessage = (data: MessageData) => {
				setActiveChatMessages([
					...(activeChatMessages!),
					data
				])
			}
			if (!newMessageResponse.loading && newMessageResponse.data?.newMessage) {
				const data = newMessageResponse.data.newMessage!
				if (data._id !== lastNewMessageID) {
					setLastNewMessageID(data._id)
					onNewMessage(data)
				}
			}
		}, [newMessageResponse, lastNewMessageID, activeChatMessages, setActiveChatMessages]
	)

	const onSubmitEditedMessage = (index: number) => {
		const editedContents = messageInputRef.current?.value!
		messageInputRef.current.value = ''
		const oldMessageData = (activeChatMessages!)[index]
		const updateState = () => {
			const msgs = [...(activeChatMessages!)]
			const msg = {
				...msgs[index],
				contents: editedContents,
			}
			setActiveChatMessages([
				...msgs.slice(0, index),
				msg,
				...msgs.slice(index + 1)
			])
		}
		updateState()
		editMessageMutator({
			variables: {
				messageID: oldMessageData._id!,
				newMessageContents: editedContents,
			}
		})  // TODO: errors from editMessageMutator should be handled
		setIndexOfMessageToEdit(undefined)
	}

	const onEditMessage = (index: number) => {
		messageInputRef.current.value = (activeChatMessages!)[index].contents
		setIndexOfMessageToEdit(indexOfFocusedMessage)
		setIndexOfFocusedMessage(undefined)
	}

	const onDeleteMessage = (index: number) => {
		setIndexOfFocusedMessage(undefined)
		deleteMessageMutator({
			variables: {
				messageID: (activeChatMessages!)[index]._id!,
			}
		})  // TODO: errors from deleteMessageMutator should be handled
		const msgs = (activeChatMessages!).filter((_: any, i: number) => i !== index)
		setActiveChatMessages(msgs)
	}

	useEffect(
		() => {
			if (lastMessageRef.current && needsScrollingIntoViewOfLastMessage) {
				lastMessageRef.current.scrollIntoView({ behaviour: 'smooth', block: 'center' })
			}
			setNeedsScrollingIntoViewOfLastMessage(false)
		}, [activeChatMessages, needsScrollingIntoViewOfLastMessage, setNeedsScrollingIntoViewOfLastMessage]
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
		setNeedsScrollingIntoViewOfLastMessage(true)
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
				_id: undefined
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
						if (res.data.createMessage.status.ok) {
							// make loading message to be displayed as already sended one
							for (let messageIndex = 0; messageIndex < newMessages.length; messageIndex += 1) {
								if (newMessages[messageIndex] === newMessageData) {
									const msgs = [...newMessages]
									msgs[messageIndex].loading = false
									msgs[messageIndex]._id = res.data.createMessage.newMessage._id!
									setActiveChatMessages(msgs)
									break;
								}
							}
						} else if (res.data.createMessage.status.message) {
							// make loading message to be displayed as a bad one
							// and display res.createMessage.message as an error description
							onCreateMessageError(res.data.createMessage.status.message)
						}
					},
					(err) => onCreateMessageError(err.toString())
				)
		}
	}

	const onSettingsClick = () => {
		setChatSettingsOpened(!chatSettingsOpened)
	}

	const onRenameChat = () => {
		if (document) {
			const validDocument = document as any
			validDocument.getElementById('rename-chat-modal').showModal()
		}
	}

	const onEditMessageCancel = () => {
		setIndexOfMessageToEdit(undefined)
		if (messageInputRef.current) {
			(messageInputRef.current!).value = ''
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
			<span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
				{"Choose a chat"}
			</span>
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

	if (chatSettingsOpened) {
		return (
			<ChatSettingsDashboard sessionData={sessionData} activeChatName={activeChatName} />
		)
	}

	return (
		<div className="flex flex-col items-center justify-between gap-4 w-full h-full">
			<div className="p-4 overflow-y-scroll overflow-x-hidden max-h-max max-w-[720px] w-full flex flex-col gap-2">
				{ activeChatMessages &&
					activeChatMessages.map(
						(msg: MessageData, index: number) => (
							<div key={index} className={"flex flex-col gap-2 chat" + (msg.authorUsername === sessionData?.username ? ' chat-end' : ' chat-start')} ref={index === activeChatMessages.length-1 ? lastMessageRef : undefined}>
								<div className="flex flex-col gap-1 text-sm">
									<span className="text-sm text-success">
										{msg.authorUsername !== sessionData.username
											? msg.authorUsername
											: ''
										}
									</span>
									<span>
										{format(msg.date, 'hh:mm:ss yyyy/MM/dd')}
									</span>
								</div>
								<button className="chat-bubble flex flex-col justify-center gap-2" onFocus={() => setIndexOfFocusedMessage(msg.authorUsername === sessionData.username ? index : undefined)} onBlur={() => setIndexOfFocusedMessage(undefined)} disabled={msg._id ? false : true}>
									<span className="break-words relative">
										<span className={(indexOfFocusedMessage === index ? 'blur-sm' : ' ')}>
											{msg.contents}
										</span>
										{index === indexOfFocusedMessage &&
											<ul className="z-[2] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 menu bg-base-200 p-2 shadow w-52">
												<li>
													<a onClick={() => onEditMessage(index)} className="flex items-center gap-2">
														<EditIcon />
														<span>
															Edit
														</span>
													</a>
												</li>
												<li>
													<a onClick={() => onDeleteMessage(index)} className="flex items-center gap-2 text-error">
														<DeleteIcon />
														<span>
															Delete
														</span>
													</a>
												</li>
											</ul>
										}
									</span>
									{msg.errorMessage &&
										<span className="text-error font-bold">
											{msg.errorMessage}
										</span>
									}
									{msg.loading &&
										<span className="loading loading-dots" />
									}
								</button>
							</div>
						)
					)
				}
			</div>
			<div className="flex flex-col w-full gap-2 max-w-[720px]">
				<div className="flex w-full bg-neutral gap-2 p-2 items-center">
					<input className="input input-bordered w-full" type="text" placeholder="Message" ref={messageInputRef} />
					<button className="btn btn-primary btn-square" onClick={indexOfMessageToEdit === undefined ? onSendMessage : () => onSubmitEditedMessage(indexOfMessageToEdit!)}>
						{indexOfMessageToEdit === undefined ? <SendIcon /> : <EditIcon />}
					</button>
					<button className="btn btn-primary btn-square" onClick={indexOfMessageToEdit ? onEditMessageCancel : undefined}>
						{indexOfMessageToEdit ? (
							<CancelIcon />
						): (
							<AttachIcon />
						)}
					</button>
				</div>
				<div className="flex w-full bg-neutral p-2 items-center">
					<span className="flex flex-grow justify-center font-bold">
						{activeChatName}
					</span>
					<div tabIndex={0}>
						<button className={"btn btn-primary btn-square"} onClick={onSettingsClick}>
							<SettingsIcon />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

