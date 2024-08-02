'use server'

import type MsgData from '@/lib/MsgData'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient

export async function fetchChatMembers() {
	return {  // random data
		'afjkDFJK5835KFJDL': [
			'3289jklsdjkfl',
			'kjfdkldas8834'
		],
		'sdjkf': [
			'238u23jr23nnNM<',
		],
	}
}

export async function fetchChatsUserBelongsTo(userID: number) {
	const result = await prisma.user.findUnique({
		where: {
			ID: userID,
		},
		select: {
			chats: {
				select: {
					chat: {
						select: {
							ID: true,
							name: true,
						}
					}
				}
			}
		}
	})

	if (result == null) {
		return {
			statusSuccess: false,
			data: [],
		}
	}

	return {
		statusSuccess: true,
		data: result.chats.map((data: any) => ({ ID: data.chat.ID as number, name: data.chat.name as string })),
	}
}

export async function fetchMessagesByChatID(chatID: number)
: Promise<{ statusSuccess: boolean; data: MsgData[]; }> {
	const result = await prisma.message.findMany({
		where: {
			chatID: {
				equals: chatID,
			}
		}
	})

	return {
		statusSuccess: true,
		data: result,
	}
}

export async function saveMessageToDB({ chatID, authorID, contents }: MsgData) {
	await prisma.message.create({
		data: {
			contents,
			chat: {
				connect: {
					ID: chatID,
				}
			},
			author: {
				connect: {
					ID: authorID,
				}
			}
		},
	})
}

export async function createChat(name: string, authorID: number) {
	await prisma.chat.create({
		data: {
			name,
			users: {
				create: [
					{
						user: {
							connect: {
								ID: authorID,
							}
						}
					}
				]
			}
		}
	})
}

