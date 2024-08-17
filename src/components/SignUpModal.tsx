'use client'

import { useState } from 'react'
import gqlClient from '@/graphql/gqlClient'
import { useMutation, gql } from '@apollo/client'
import ErrorIcon from '@/components/ErrorIcon'
import SuccessIcon from '@/components/SuccessIcon'
import UserIcon from '@/components/UserIcon'
import PasswordIcon from '@/components/PasswordIcon'


const signUpMutation = gql`
mutation SignUp($username: String!, $password: String!) {
	signUp(
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

export default function SignUpModal() {
	const [usernameValue, setUsernameValue] = useState('')
	const [passwordValue, setPasswordValue] = useState('')
	const [passwordCopyValue, setPasswordCopyValue] = useState('')
	const [signUpMutator, signUpResponse] = useMutation(signUpMutation)
	const [passwordsEquality, setPasswordsEquality] = useState(true)

	const onUsernameValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsernameValue(event.target.value as string)
	}

	const onPasswordValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordValue(event.target.value as string)
	}

	const onPasswordCopyValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordCopyValue(event.target.value as string)
	}

	const onSignUp = () => {
		setPasswordsEquality(passwordValue === passwordCopyValue)
		if (passwordValue === passwordCopyValue) {
			signUpMutator(
				{
					variables: {
						username: usernameValue,
						password: passwordValue,
					}
				}
			).then(
				(res: any) => {
					if (res.data?.signUp?.ok && window?.location) {
						window.location.reload()
					}
				}
			)
		}
	}

	return (
		<div>
			<dialog id="sign-up-modal" className="modal">
				<div className="modal-box">
					<div className="flex flex-col gap-4">
						<label className="input input-bordered flex items-center gap-2">
							<UserIcon />
							<input disabled={signUpResponse.loading} type="text" className="grow" placeholder="Username" value={usernameValue} onChange={onUsernameValueChange} />
						</label>
						<label className="input input-bordered flex items-center gap-2">
							<PasswordIcon />
							<input disabled={signUpResponse.loading} type="password" className="grow" placeholder="Password" value={passwordValue} onChange={onPasswordValueChange} />
						</label>
						<label className="input input-bordered flex items-center gap-2">
							<PasswordIcon />
							<input disabled={signUpResponse.loading} type="password" className="grow" placeholder="Password (again)" value={passwordCopyValue} onChange={onPasswordCopyValueChange} />
						</label>
						{signUpResponse.error &&
							<div role="alert" className="alert alert-error">
								<ErrorIcon />
								<span>{signUpResponse.error.message ?? ''}</span>
							</div>
						}
						{signUpResponse.data?.signUp?.message &&
							<div role="alert" className={"alert " + (signUpResponse.data?.signUp?.ok ? 'alert-success' : 'alert-error')}>
								{signUpResponse.data?.signUp?.ok
									? <SuccessIcon />
									: <ErrorIcon />
								}
								{signUpResponse.data?.signUp?.message}
							</div>
						}
						{!passwordsEquality && 
							<div role="alert" className="alert alert-error">
								<ErrorIcon />
								<span>
									{'Passwords are not equal.'}
								</span>
							</div>
						}
					</div>
					<div className="modal-action">
						<form method="dialog">
							<button className="btn btn-secondary btn-ghost">
								Close
							</button>
						</form>
						<button className="btn btn-primary flex gap-2 items-center" onClick={onSignUp} disabled={signUpResponse.loading}>
							<span>
								Sign Up
							</span>
							{signUpResponse.loading &&
								<span className="loading loading-spinner" />
							}
						</button>
					</div>
				</div>
			</dialog>
		</div>
	)
}

