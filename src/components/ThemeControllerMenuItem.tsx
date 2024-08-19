import { forwardRef, useRef } from 'react'
import ThemeController from '@/components/ThemeController'


export default function ThemeControllerMenuItem() {
	const ThemeControllerForwardRef = forwardRef(ThemeController)
	const themeControllerRef = useRef<any>(undefined)

	return (
		<li>
			<a onClick={() => themeControllerRef?.current && themeControllerRef.current.click()} className="flex justify-between items-center">
				<span>Day/night mode</span>
				<ThemeControllerForwardRef ref={themeControllerRef} />
			</a>
		</li>
	)
}

