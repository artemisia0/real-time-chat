import { atom } from 'jotai'


const userChatsAtom = atom<undefined | { _id: string; name: string; }[]>(undefined)

export default userChatsAtom

