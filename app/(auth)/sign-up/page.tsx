'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

const formSchema = z.object({ email: z.string().email(), password: z.string().min(6) })
type TForm = z.infer<typeof formSchema>

export default function SignUp() {
	const form = useForm<TForm>({ defaultValues: { email: '', password: '' }, resolver: zodResolver(formSchema) })

	async function signUp(formData: TForm) {
		const origin = process.env.NEXT_PUBLIC_ORIGIN_URL
		const supabase = createClient()

		const { error } = await supabase.auth.signUp({ ...formData, options: { emailRedirectTo: `${origin}/auth/callback` } })
		if (error) return toast.error(error.message)

		return toast.success('Check email to continue sign in process')
	}

	return (
		<Form {...form}>
			<form className='w-full max-w-lg pt-20 mx-auto space-y-4' onSubmit={form.handleSubmit(signUp)}>
				<div className='flex items-end justify-between'>
					<h1 className='text-3xl font-bold tracking-tight text-primary'>Sign up</h1>
					<Link className={buttonVariants({ variant: 'secondary' })} href='/sign-in'>
						Sign in
					</Link>
				</div>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email address</FormLabel>
							<FormControl>
								<Input placeholder='you@example.com' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type='password' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit'>Sign up</Button>
			</form>
		</Form>
	)
}
