'use server'

import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient

export async function userExistsByUsername(name: string) {
	const user = await prisma.user.findUnique({
		where: {
			name,
		} })
	return user != null
}

export async function fetchUserDataByUsername(username: string) {
	const user = await prisma.user.findUnique({
		where: {
			name: username,
		}
	})
	
	return {
		username: user?.name ?? null,
		userID: user?.ID ?? null,
		hashedPassword: user?.hashedPassword ?? null,
	}
}

export async function fetchUserDataByUserID(userID: number) {
	const user = await prisma.user.findUnique({
		where: {
			ID: userID,
		}
	})
	
	return {
		username: user?.name ?? null,
		userID: user?.ID ?? null,
		hashedPassword: user?.hashedPassword ?? null,
	}
}

export async function createUser(name: string, hashedPassword: string) {
	await prisma.user.create({
		data: {
			name,
			hashedPassword,
		}
	})
}

