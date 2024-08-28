import { atom } from 'jotai'
import type ChatMemberData from '@/types/ChatMemberData'


const activeChatMembersAtom = atom<ChatMemberData[] | undefined>(undefined)

export default activeChatMembersAtom

