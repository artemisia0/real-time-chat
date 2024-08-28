import { atom } from 'jotai'
import type MessageData from '@/types/MessageData'


const activeChatMessagesAtom = atom<MessageData[] | undefined>(undefined)

export default activeChatMessagesAtom

