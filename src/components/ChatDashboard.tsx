import { useAtomValue } from 'jotai'
import activeChatIDAtom from '@/jotaiAtoms/activeChatIDAtom'
import type PropsWithSessionData from '@/types/PropsWithSessionData'
import SendIcon from '@/components/SendIcon'
import AttachIcon from '@/components/AttachIcon'
import SettingsIcon from '@/components/SettingsIcon'
import { useState } from 'react'
import ThemeController from '@/components/ThemeController'


export default function ChatDashboard({ sessionData }: PropsWithSessionData) {
	const activeChatID = useAtomValue(activeChatIDAtom)
	const [settingsDropdownOpened, setSettingsDropdownOpened] = useState(false)

	const onSettingsClick = () => {
		setSettingsDropdownOpened(!settingsDropdownOpened)
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
						{"Chat ID: " + activeChatID}
					</span>
					<div className={"dropdown dropdown-top dropdown-end" + (settingsDropdownOpened ? '  dropdown-opened' : ' ')}>
						<button className={"btn btn-primary btn-square"} onClick={onSettingsClick}>
							<SettingsIcon />
						</button>
						<ul tabIndex={0} className="relative dropdown-content menu bg-base-200 w-64 p-2 shadow">
							<li>
								<a className="flex justify-between items-center">
									<span>Switch day/night mode</span>
									<ThemeController />
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

