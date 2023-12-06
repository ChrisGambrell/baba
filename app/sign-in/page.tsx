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

const formSchema = z.object({ email: z.string().email(), password: z.string().min(1) })
type TForm = z.infer<typeof formSchema>

export default function SignIn() {
	const router = useRouter()
	const form = useForm<TForm>({ defaultValues: { email: '', password: '' }, resolver: zodResolver(formSchema) })

	async function signIn(formData: TForm) {
		const supabase = createClient()

		const { error } = await supabase.auth.signInWithPassword(formData)
		if (error) return toast.error(error.message)

		return router.push('/')
	}

	return (
		<div className='w-screen h-screen'>
			<Form {...form}>
				<form className='w-full max-w-lg pt-20 mx-auto space-y-4' onSubmit={form.handleSubmit(signIn)}>
					<h1 className='text-3xl font-bold tracking-tight text-primary'>Sign in</h1>
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
					<div className='flex items-center justify-between'>
						<Button type='submit'>Sign in</Button>
						<Link className={buttonVariants({ variant: 'link' })} href='/sign-up'>
							Don't have an account?
						</Link>
					</div>
				</form>
			</Form>
		</div>
	)
}
