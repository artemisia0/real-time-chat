'use client'

import MsgData from '@/lib/MsgData'
import { useState, useEffect } from 'react'
import { fetchUserDataByUserID } from '@/actions/user'


export default function ChatMessage({ msgData }: { msgData: MsgData; }) {
	const [username, setUsername] = useState('')

	useEffect(
		() => {
			const fetchData = async () => {
				const fetchedUserData = await fetchUserDataByUserID(msgData.authorID)
				setUsername(fetchedUserData.username ?? "")
			}
			fetchData()
		}, [msgData.authorID]
	)


	return (
		<div className="flex p-1 m-1 flex-col border border-gray-900 rounded-sm bg-amber-500">
			<div className="bg-gray-500">
				{username}
			</div>
			<div className="bg-gray-600">
				{msgData.contents}
			</div>
		</div>
	)
}

