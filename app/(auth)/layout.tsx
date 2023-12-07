import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className='w-screen h-screen'>
			<div className='w-full max-w-lg pt-20 mx-auto'>{children}</div>
		</div>
	)
}
