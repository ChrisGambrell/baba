// TODO: Mobile view

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileForm from './components/profile-form'

export default async function Index({ searchParams }: { searchParams: { message?: string } }) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const {
		data: { session },
	} = await supabase.auth.getSession()
	const { data: profile } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', session?.user.id || '')
		.single()
	if (!session || !profile) return redirect('/sign-in')

	async function signOut() {
		'use server'

		const cookieStore = cookies()
		const supabase = createClient(cookieStore)

		const { error } = await supabase.auth.signOut()
		if (error) return redirect(`/?message=${error.message}`)

		return redirect('/sign-in')
	}

	return (
		<div className='w-screen h-screen'>
			<div className='w-full max-w-lg pt-8 mx-auto space-y-4'>
				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold tracking-tight text-primary'>Hello, {profile.first_name}!</h1>
					<form action={signOut}>
						<Button variant='destructive'>Sign out</Button>
						{!!searchParams.message && <p className='px-2 py-1 mt-4 bg-primary/20'>{searchParams.message}</p>}
					</form>
				</div>
				<ProfileForm profile={profile} />
			</div>
		</div>
	)
}
