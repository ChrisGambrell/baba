import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/server'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function SignUp({ searchParams }: { searchParams: { message?: string } }) {
	async function signUp(formData: FormData) {
		'use server'

		const origin = headers().get('origin')
		const email = formData.get('email') as string
		const password = formData.get('password') as string
		const cookieStore = cookies()
		const supabase = createClient(cookieStore)

		const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${origin}/auth/callback` } })
		if (error) return redirect(`/sign-up?message=${error.message}`)

		return redirect('/sign-up?message=Check email to continue sign in process')
	}

	return (
		<div className='w-screen h-screen'>
			<form className='w-full max-w-lg pt-20 mx-auto space-y-4' action={signUp}>
				<h1 className='text-3xl font-bold tracking-tight'>Sign up</h1>
				<div className='space-y-1.5'>
					<Label htmlFor='email'>Email address</Label>
					<Input name='email' type='email' />
				</div>
				<div className='space-y-1.5'>
					<Label htmlFor='password'>Password</Label>
					<Input name='password' type='password' />
				</div>
				<div className='flex items-center justify-between'>
					<Button>Sign up</Button>
					<Link className={buttonVariants({ variant: 'link' })} href='/sign-in'>
						Already have an account?
					</Link>
				</div>
				{searchParams.message && <p className='px-2 py-1 rounded-md text-foreground bg-primary/10'>{searchParams.message}</p>}
			</form>
		</div>
	)
}
