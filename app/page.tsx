import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Index({ searchParams }: { searchParams: { message?: string } }) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const {
		data: { session },
	} = await supabase.auth.getSession()
	if (!session) return redirect('/sign-in')

	async function signOut() {
		'use server'

		const cookieStore = cookies()
		const supabase = createClient(cookieStore)

		const { error } = await supabase.auth.signOut()
		if (error) return redirect(`/?message=${error.message}`)

		return redirect('/sign-in')
	}

	return (
		<div>
			{!!session.user && (
				<form action={signOut}>
					<Button variant='destructive'>Sign out</Button>
					{!!searchParams.message && <p className='px-2 py-1 mt-4 bg-primary/20'>{searchParams.message}</p>}
				</form>
			)}
			<pre>{JSON.stringify(session.user, null, 2)}</pre>
		</div>
	)
}
