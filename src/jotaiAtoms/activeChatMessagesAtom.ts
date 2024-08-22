import { atom } from 'jotai'


const activeChatMessagesAtom = atom<{ loading?: boolean; errorMessage?: string; authorUsername: string; date: Date; contents: string; }[] | undefined>(undefined)

export default activeChatMessagesAtom

