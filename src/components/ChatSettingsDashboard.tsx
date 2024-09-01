import chatSettingsOpenedAtom from '@/jotaiAtoms/chatSettingsOpenedAtom'
import { useAtom, useAtomValue } from 'jotai'
import BackArrowIcon from '@/components/BackArrowIcon'
import { useQuery, useMutation, gql } from '@apollo/client'
import activeChatIDAtom from '@/jotaiAtoms/activeChatIDAtom'
import type SessionData from '@/types/SessionData'
import { useState, useEffect, useRef } from 'react'
import DeleteIcon from '@/components/DeleteIcon'
import EditIcon from '@/components/EditIcon'
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
		if (!activeChatMembers) {
			return;
		}
		if (!usernameInputRef?.current?.value) {
			return;
		}
		const previousActiveChatMembers = [...(activeChatMembers!)]
		const newChatMember = {
			username: usernameInputRef.current.value!,
			role: 'member',
		}
		const updateState = () => {
			setActiveChatMembers([
				newChatMember,
				...(activeChatMembers!),
			])
		}
		updateState()
		addChatMemberMutator({
			variables: {
				chatID,
				...newChatMember,
			}
		}).then(
				(res: any) => {
					if (res?.data?.addChatMember?.status?.ok === false) {
						setActiveChatMembers(previousActiveChatMembers)
					}
				}
			)
	}

	return (
		<div className="flex flex-col items-center w-full gap-2 bg-base-200">
			<div className="flex items-center w-full p-2 gap-2">
				<input className="input input-bordered grow" placeholder="Username" ref={usernameInputRef} disabled={addChatMemberResponse.loading}/>
				<button className="flex justify-center items-center btn btn-square btn-primary" onClick={onSubmit} disabled={addChatMemberResponse.loading}>
					<PlusIcon />
				</button>
			</div>
			{addChatMemberResponse.loading &&
				<span className="loading loading-dots" />
			}
			{(addChatMemberResponse?.error?.message || addChatMemberResponse?.data?.addChatMember?.status?.ok === false) && 
				<div className="text-error font-bold">
					<span>
						{addChatMemberResponse?.error?.message && 
							addChatMemberResponse.error.message!
						}
					</span>
					<span>
						{addChatMemberResponse?.data?.addChatMember?.status?.ok === false &&
							addChatMemberResponse.data.addChatMember.status.message!
						}
					</span>
				</div>
			}
		</div>
	)
}

const updateChatMemberRoleMutation = gql`
mutation UpdateChatMemberRole($chatID: String!, $username: String!, $role: String!) {
	updateChatMemberRole(chatID: $chatID, username: $username, role: $role) {
		status {
			ok
			message
		}
	}
}
`

function UserDashboard({ role, username, chatID, indexOfThis }: { role: string; username: string; chatID: string; indexOfThis: number; }) {
	const [activeChatMembers, setActiveChatMembers] = useAtom(activeChatMembersAtom)
	const [removeChatMemberMutator, removeChatMemberResponse] = useMutation(removeChatMemberMutation)
	const chatMemberEditDropdownRef = useRef<any>(undefined)
	const [updateChatMemberRoleMutator, updateChatMemberRoleResponse] = useMutation(updateChatMemberRoleMutation)

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

	const onChatMemberChangeRole = (newRole: string) => {
		if (!activeChatMembers) {
			return;
		}
		if (chatMemberEditDropdownRef.current) {
			(chatMemberEditDropdownRef.current!).blur()
		}
		const updateState = () => {
			setActiveChatMembers([
				...(activeChatMembers!).slice(0, indexOfThis),
				{
					username,
					role: newRole,
				},
				...(activeChatMembers!).slice(indexOfThis+1)
			])
		}
		updateState()

		updateChatMemberRoleMutator({
			variables: {
				chatID,
				username,
				role: newRole,
			}
		}).then(
				(res: any) => {
					if (res.error?.message) {
						console.error(res.error.message!)
					}
					if (res.data?.updateChatMemberRole?.status?.ok === false) {
						console.error(res.data.updateChatMemberRole.status.message!)
					}
					if (res.error?.graphQLErrors) {
						console.error(JSON.stringify(res.error.graphQLErrors!))
					}
				}
			)
	}

	const chatMemberEditMenuItems = [
		{
			onClick: () => onChatMemberChangeRole('member'),
			label: 'Member',
		},
		{
			onClick: () => onChatMemberChangeRole('admin'),
			label: 'Admin',
		},
	]

	return (
		<div className="p-2 flex items-center justify-between w-full bg-base-200">
			<div className="flex gap-2 items-center">
				<div className="w-8 h-8">
					<img src="/profile.png" alt="User profile image" />
				</div>
				<span>
					{ username }
				</span>
			</div>
			<div className="flex items-center gap-2">
				<span className="text-sm">
					{ role }
				</span>
				<div tabIndex={0} className="dropdown dropdown-left btn btn-square btn-primary btn-sm flex items-center justify-center">
					<EditIcon />
					<ul tabIndex={0} className="dropdown-content menu shadow z-[1] w-52 p-2 bg-base-300" ref={chatMemberEditDropdownRef}>
						{chatMemberEditMenuItems.map(
							(item: any, index: number) => (
								<li key={index} onClick={item.onClick}>
									<a>
										{item.label}
									</a>
								</li>
							)
						)}
					</ul>
				</div>
				<div className="flex justify-center items-center">
					<button className="btn btn-square btn-primary btn-sm" onClick={onChatMemberRemoval}>
						<DeleteIcon />
					</button>
				</div>
			</div>
		</div>
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

	const onRenameChat = () => {
		if (document) {
			const validDocument = document as any
			validDocument.getElementById('rename-chat-modal').showModal()
		}
	}

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
					<button className="btn btn-neutral flex justify-center items-center w-full" onClick={onRenameChat}>
						{"Rename chat"}
					</button>
					<ChatMemberInput chatID={activeChatID!} />
					{activeChatMembers && (activeChatMembers!).map(
							(chatMember: ChatMemberData, index: number) => (
								<UserDashboard username={chatMember.username} role={chatMember.role} key={index} chatID={activeChatID!} indexOfThis={index} />
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

