import RootPage from '@/components/RootPage'
import { getSessionData } from '@/actions/session'


export default async function Page() {
	const sessionData = await getSessionData()

	return (
		<RootPage sessionData={sessionData} />
	)
}

