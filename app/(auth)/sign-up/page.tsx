// TODO: Mobile view

'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

const formSchema = z.object({
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	email: z.string().email(),
	password: z.string().min(6),
})
type TForm = z.infer<typeof formSchema>

export default function SignUp() {
	const router = useRouter()
	const form = useForm<TForm>({
		defaultValues: { first_name: '', last_name: '', email: '', password: '' },
		resolver: zodResolver(formSchema),
	})

	async function signUp({ email, password, ...formData }: TForm) {
		const origin = process.env.NEXT_PUBLIC_ORIGIN_URL
		const supabase = createClient()

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: { data: formData, emailRedirectTo: `${origin}/auth/callback` },
		})
		if (error) return toast.error(error.message)

		toast.success('Check email to continue sign in process')
		return router.push('/sign-in')
	}

	return (
		<Form {...form}>
			<form className='space-y-4' onSubmit={form.handleSubmit(signUp)}>
				<div className='flex items-end justify-between'>
					<h1 className='text-3xl font-bold tracking-tight text-primary'>Sign up</h1>
					<Link className={buttonVariants({ variant: 'secondary' })} href='/sign-in'>
						Sign in
					</Link>
				</div>
				<FormField
					control={form.control}
					name='first_name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>First name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='last_name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
