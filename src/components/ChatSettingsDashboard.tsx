import chatSettingsOpenedAtom from '@/jotaiAtoms/chatSettingsOpenedAtom'
import { useAtom, useAtomValue } from 'jotai'
import BackArrowIcon from '@/components/BackArrowIcon'
import { useQuery, useMutation, gql } from '@apollo/client'
import activeChatIDAtom from '@/jotaiAtoms/activeChatIDAtom'
import type SessionData from '@/types/SessionData'
import { useState, useEffect, useRef } from 'react'
import DeleteIcon from '@/components/DeleteIcon'
import activeChatMembersAtom from '@/jotaiAtoms/activeChatMembersAtom'
import type ChatMemberData from '@/types/ChatMemberData'
import PlusIcon from '@/components/PlusIcon'


const chatMembersQuery = gql`
query ChatMembers($chatID: String!) {
	chatMembers(chatID: $chatID) {
		role
		username
	}
}
`

const removeChatMemberMutation = gql`
mutation RemoveChatMember($username: String!, $chatID: String!) {
	removeChatMember(username: $username, chatID: $chatID) {
		status {
			ok
			message
		}
	}
}
`

const addChatMemberMutation = gql`
mutation AddChatMember($username: String!, $role: String!, $chatID: String!) {
	addChatMember(username: $username, role: $role, chatID: $chatID) {
		status {
			ok
			message
		}
	}
}
`

function ChatMemberInput({ chatID }: { chatID: string; }) {
	const [addChatMemberMutator, addChatMemberResponse] = useMutation(addChatMemberMutation)
	const usernameInputRef = useRef<any>(undefined)
	const [activeChatMembers, setActiveChatMembers] = useAtom(activeChatMembersAtom)

	const onSubmit = () => {
		if (!usernameInputRef?.current?.value) {
			return;
		}
		const newChatMember = {
			username: usernameInputRef.current.value!,
			role: 'member',
		}
		const updateState = () => {
			setActiveChatMembers([
				...(activeChatMembers!),
				newChatMember,
			])
		}
		updateState()
		addChatMemberMutator({
			variables: {
				chatID,
				...newChatMember,
			}
		})
	}

	return (
		<div className="flex flex-col items-center w-full bg-base-300 gap-2">
			<div className="flex items-center w-full p-2 gap-2 bg-base-300">
				<input className="input input-bordered grow" placeholder="Username" ref={usernameInputRef} />
				<button className="flex justify-center items-center btn btn-square btn-primary" onClick={onSubmit}>
					<PlusIcon />
				</button>
			</div>
			{addChatMemberResponse?.error?.message && 
				<div className="text-error font-bold">
					{addChatMemberResponse.error.message!}
				</div>
			}
		</div>
	)
}

function UserDashboard({ role, username, chatID }: { role: string; username: string; chatID: string; }) {
	const [hovered, setHovered] = useState(false)
	const [activeChatMembers, setActiveChatMembers] = useAtom(activeChatMembersAtom)
	const [removeChatMemberMutator, removeChatMemberResponse] = useMutation(removeChatMemberMutation)

	const onChatMemberRemoval = () => {
		if (activeChatMembers) {
			setActiveChatMembers((activeChatMembers!).filter((member: ChatMemberData) => member.username !== username))
		}
		removeChatMemberMutator({
			variables: {
				username,
				chatID,
			}
		})  // possible errors should be handled
	}

	return (
		<button className="p-2 flex items-center justify-between w-full relative hover:bg-error bg-base-300" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onChatMemberRemoval}>
			{hovered &&
				<div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
					<DeleteIcon />
				</div>
			}
			<div className="flex gap-2 items-center">
				<div className="w-8 h-8">
					<img src="/profile.png" alt="User profile image" />
				</div>
				<span>
					{ username }
				</span>
			</div>
			<span className="text-sm">
				{ role }
			</span>
		</button>
	)
}

export default function ChatSettingsDashboard({ activeChatName, sessionData }: { activeChatName: string; sessionData: SessionData; }) {
	const [chatSettingsOpened, setChatSettingsOpened] = useAtom(chatSettingsOpenedAtom)
	const activeChatID = useAtomValue(activeChatIDAtom)
	const chatMembersQueryResponse = useQuery(chatMembersQuery, {
		variables: {
			chatID: activeChatID!,
		}
	})
	const [activeChatMembers, setActiveChatMembers] = useAtom(activeChatMembersAtom)

	useEffect(
		() => {
			if (chatMembersQueryResponse?.data?.chatMembers) {
				setActiveChatMembers(chatMembersQueryResponse.data.chatMembers!)
			}
		}, [setActiveChatMembers, chatMembersQueryResponse]
	)

	return (
		<div className="flex flex-col items-center justify-between gap-4 w-full h-full">
			{chatMembersQueryResponse.loading &&
				<div className="flex justify-center">
					<span className="loading loading-dots" />
				</div>
			}
			{chatMembersQueryResponse.error &&
				<div className="text-error font-bold flex flex-col gap-2">
					{chatMembersQueryResponse.error.graphQLErrors.map(({ message }, i) => (
						<span key={i}>{message}</span>
					))}
				</div>
			}
			{!chatMembersQueryResponse.loading &&
				<div className="flex flex-col gap-2 max-w-[720px] w-full justify-center items-center">
					<ChatMemberInput chatID={activeChatID!} />
					{activeChatMembers && (activeChatMembers!).map(
							(chatMember: ChatMemberData, index: number) => (
								<UserDashboard username={chatMember.username} role={chatMember.role} key={index} chatID={activeChatID!} />
							)
						)
					}
				</div>
			}
			<div className="flex flex-col w-full gap-2 max-w-[720px]">
				<div className="flex w-full bg-neutral p-2 items-center">
					<span className="flex flex-grow justify-center font-bold">
						{activeChatName}
					</span>
					<div tabIndex={0}>
						<button className={"btn btn-primary btn-square"} onClick={() => setChatSettingsOpened(false)}>
							<BackArrowIcon />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

