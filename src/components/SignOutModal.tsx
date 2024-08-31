import { gql, useMutation } from '@apollo/client'
import SuccessIcon from '@/components/SuccessIcon'
import ErrorIcon from '@/components/ErrorIcon'
import WarningIcon from '@/components/WarningIcon'


const signOutMutation = gql`
mutation SignOut {
	signOut {
		sessionToken
	}
}
`

export default function SignOutModal() {
	const [signOut, signOutResponse] = useMutation(signOutMutation)

	const onConfirm = () => {
		signOut().then(
			(res: any) => {
				if (window?.localStorage) {
					localStorage.setItem('sessionToken', res?.data?.signOut?.sessionToken!)
				}
				if (window?.location) {
					window.location.reload()
				}
			}
		)
	}

	return (
		<div>
			<dialog id="sign-out-modal" className="modal">
				<div className="modal-box">
					<div className="flex flex-col gap-4">
						<div role="alert" className="alert">
							<WarningIcon />
							<span>
								<span>
									{'Do You want to'}
								</span>
								<span className="text-accent">
									{' sign out '}
								</span>
								<span>
									{'from your account?'}
								</span>
							</span>
						</div>
					</div>
					<div className="modal-action">
						<form method="dialog">
							<button className="btn btn-secondary btn-ghost">
								Cancel
							</button>
						</form>
						<button className="btn btn-primary flex gap-2 items-center" onClick={onConfirm} disabled={signOutResponse.loading}>
							<span>
								Confirm
							</span>
							{signOutResponse.loading &&
								<span className="loading loading-spinner" />
							}
						</button>
					</div>
				</div>
			</dialog>
		</div>
	)
}

