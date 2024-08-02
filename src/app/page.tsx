import InteractiveMainPage from '@/components/InteractiveMainPage'
import { getSession } from '@/actions/session'
import sessionToPlainObject from '@/lib/sessionToPlainObject'


export default async function Page() {
	const session = sessionToPlainObject(await getSession())

	return (
		<InteractiveMainPage session={session} />
	)
}

