import { useAtomValue, useAtom } from 'jotai'
import activeChatIDAtom from '@/jotaiAtoms/activeChatIDAtom'
import type PropsWithSessionData from '@/types/PropsWithSessionData'
import SendIcon from '@/components/SendIcon'
import AttachIcon from '@/components/AttachIcon'
import SettingsIcon from '@/components/SettingsIcon'
import { useState, useRef } from 'react'
import userChatsAtom from '@/jotaiAtoms/userChatsAtom'
import { useMutation, gql } from '@apollo/client'


const leaveChatMutation = gql`
mutation LeaveChat($username: String!, $chatID: String!) {
	leaveChat(username: $username, chatID: $chatID) {
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

	const onSettingsClick = () => {
		setSettingsDropdownOpened(!settingsDropdownOpened)
		if (settingsDropdownRef?.current) {
			settingsDropdownRef.current.blur()
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

	const messages = [
		{
			username: 'user123',
			contents: 'First message ever written!',
		},
		{
			username: 'artem',
			contents: 'Hi out there! I can send messages too!!',
		},
		{
			username: 'user123',
			contents: 'First message ever written!',
		},
		{
			username: 'artem',
			contents: 'Hi out there! I can send messages too!!',
		},
		{
			username: 'artem',
			contents: 'Hi out there! I can send messages too!!',
		},
		{
			username: 'artem',
			contents: 'Hi out there! I can send messages too!!',
		},
		{
			username: 'user123',
			contents: 'First message ever written!',
		},
		{
			username: 'user123',
			contents: 'First message ever written!',
		},
		{
			username: 'user123',
			contents: 'First message ever written!',
		},
		{
			username: 'user123',
			contents: 'First message ever written!',
		},
		{
			username: 'artem',
			contents: 'Hi out there! I can send messages too!!',
		},
		{
			username: 'user123',
			contents: 'First message ever written!',
		},
		{
			username: 'artem',
			contents: 'Hi out there! I can send messages too!!',
		},
		{
			username: 'artem',
			contents: 'Hi out there! I can send messages too!!',
		},
		{
			username: 'artem',
			contents: 'Hi out there! I can send messages too!!',
		},
		{
			username: 'user123',
			contents: 'First message ever written!',
		},
		{
			username: 'user123',
			contents: 'First message ever written!',
		},
		{
			username: 'user123',
			contents: 'First message ever written!',
		},
	]

	if (!activeChatID) {
		return (
			<div />
		)
	}

	// go through all userChats and find one where _id is activeChatID
	// then its name is activeChatName
	
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
				{
					messages.map(
						(msg, index) => (
							<div key={index} className={"flex flex-col gap-2 chat" + (msg.username === sessionData?.username ? ' chat-end' : ' chat-start')}>
								<div className="font-bold">
									{msg.username !== sessionData.username
										? msg.username
										: ''
									}
								</div>
								<div className="chat-bubble">
									{msg.contents}
								</div>
							</div>
						)
					)
				}
			</div>
			<div className="flex flex-col w-full gap-2 max-w-[720px]">
				<div className="flex w-full bg-neutral gap-2 p-2 items-center">
					<input className="input input-bordered w-full" type="text" placeholder="Message" />
					<button className="btn btn-primary btn-square">
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
								<a className="flex items-center gap-2 text-error" onClick={onLeaveChat}>
									<LeaveIcon />
									<span className="font-bold">
										Leave group
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

