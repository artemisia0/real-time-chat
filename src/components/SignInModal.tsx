'use client'

import { useState } from 'react'
import gqlClient from '@/graphql/gqlClient'
import { useMutation, gql } from '@apollo/client'
import ErrorIcon from '@/components/ErrorIcon'
import SuccessIcon from '@/components/SuccessIcon'
import UserIcon from '@/components/UserIcon'
import PasswordIcon from '@/components/PasswordIcon'


const signInMutation = gql`
mutation SignIn($username: String!, $password: String!) {
	signIn(
		userCredentials: {
			username: $username
			password: $password
		}
	) {
		ok
		message
	}
}
`

export default function SignInModal() {
	const [usernameValue, setUsernameValue] = useState('')
	const [passwordValue, setPasswordValue] = useState('')
	const [signInMutator, signInResponse] = useMutation(signInMutation)

	const onUsernameValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsernameValue(event.target.value as string)
	}

	const onPasswordValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordValue(event.target.value as string)
	}

	const onSignIn = () => {
		signInMutator(
			{
				variables: {
					username: usernameValue,
					password: passwordValue,
				}
			}
		).then(
			(res: any) => {
				if (res.data?.signIn?.ok && window?.location) {
					window.location.reload()
				}
			}
		)
	}

	return (
		<div>
			<dialog id="sign-in-modal" className="modal">
				<div className="modal-box">
					<div className="flex flex-col gap-4">
						<label className="input input-bordered flex items-center gap-2">
							<UserIcon />
							<input disabled={signInResponse.loading} type="text" className="grow" placeholder="Username" value={usernameValue} onChange={onUsernameValueChange} />
						</label>
						<label className="input input-bordered flex items-center gap-2">
							<PasswordIcon />
							<input disabled={signInResponse.loading} type="password" className="grow" placeholder="Password" value={passwordValue} onChange={onPasswordValueChange} />
						</label>
						{signInResponse.error &&
							<div role="alert" className="alert alert-error">
								<ErrorIcon />
								<span>{signInResponse.error.message ?? ''}</span>
							</div>
						}
						{signInResponse.data?.signIn?.message &&
							<div role="alert" className={"alert " + (signInResponse.data?.signIn?.ok ? 'alert-success' : 'alert-error')}>
								{signInResponse.data?.signIn?.ok
									? <SuccessIcon />
									: <ErrorIcon />
								}
								{signInResponse.data?.signIn?.message}
							</div>
						}
					</div>
					<div className="modal-action">
						<form method="dialog">
							<button className="btn btn-secondary btn-ghost">
								Close
							</button>
						</form>
						<button className="btn btn-primary flex gap-2 items-center" onClick={onSignIn} disabled={signInResponse.loading}>
							<span>
								Sign In
							</span>
							{signInResponse.loading &&
								<span className="loading loading-spinner" />
							}
						</button>
					</div>
				</div>
			</dialog>
		</div>
	)
}

