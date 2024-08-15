import ThemeController from '@/components/ThemeController'


export default function Page() {
	return (
		<div className="drawer sm:drawer-open">
			<input id="main-drawer" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content p-2">
				<div className="flex w-full">
					<label htmlFor="main-drawer" className="btn btn-md btn-circle btn-ghost sm:hidden">
						<BurgerMenuIcon />
					</label>
					<div className="flex w-full" />
					<ThemeController />
				</div>
			</div>
			<div className="drawer-side">
				<label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
				<ul className="menu bg-base-200 text-base-content min-h-full w-64 p-4">
					{/* Sidebar content here */}
					<li><a>Sidebar Item 1</a></li>
					<li><a>Sidebar Item 2</a></li>
				</ul>
			</div>
		</div>
	)
}

function BurgerMenuIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
			<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
		</svg>
	)
}

