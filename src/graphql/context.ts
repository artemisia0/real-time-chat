import { getSessionData } from '@/actions/session'
import { connectToDB } from '@/actions/db'
import type { NextRequest } from 'next/server'


const context = async (req: NextRequest) => {
	await connectToDB()
}

export default context

