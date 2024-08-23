import chatSettingsOpenedAtom from '@/jotaiAtoms/chatSettingsOpenedAtom'
import { useAtom, useAtomValue } from 'jotai'
import BackArrowIcon from '@/components/BackArrowIcon'
import { useQuery, gql } from '@apollo/client'
import activeChatIDAtom from '@/jotaiAtoms/activeChatIDAtom'
import UserIcon from '@/components/UserIcon'
import type SessionData from '@/types/SessionData'


const chatMembersQuery = gql`
query ChatMembers($chatID: String!) {
	chatMembers(chatID: $chatID) {
		role
		username
	}
}
`

export default function ChatSettingsDashboard({ activeChatName, sessionData }: { activeChatName: string; sessionData: SessionData; }) {
	const [chatSettingsOpened, setChatSettingsOpened] = useAtom(chatSettingsOpenedAtom)
	const activeChatID = useAtomValue(activeChatIDAtom)
	const chatMembersQueryResponse = useQuery(chatMembersQuery, {
		variables: {
			chatID: activeChatID!,
		}
	})

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
			<div className="flex flex-col gap-2 max-w-[720px] w-full justify-center items-center">
				{chatMembersQueryResponse?.data?.chatMembers &&
					chatMembersQueryResponse.data.chatMembers.map(
						(chatMember: { username: string; role: string; }, index: number) => (
							<div key={index} className="p-2 flex justify-between w-full bg-base-200">
								<div className="flex gap-2 items-center">
									<UserIcon />
									<span>
										{ chatMember.username }
									</span>
								</div>
								<span>
									{ chatMember.role }
								</span>
							</div>
						)
					)
				}
			</div>
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

