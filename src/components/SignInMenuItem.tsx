
function SignInIcon() {
	return (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
</svg>
	)
}

export default function SignInMenuItem() {
	const onSignIn = () => {
		if (document != null) {
			const validDocument = document as any
			validDocument.getElementById('sign-in-modal').showModal()
		}
	}

	return (
		<li>
			<a onClick={onSignIn} className="flex items-center gap-2">
				<SignInIcon />
				<span>
					Sign in
				</span>
			</a>
		</li>
	)
}


