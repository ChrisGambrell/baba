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

const formSchema = z.object({ password: z.string().min(6), confirm_password: z.string() })
type TForm = z.infer<typeof formSchema>

export default function ResetPassword() {
	const router = useRouter()
	const form = useForm<TForm>({ defaultValues: { password: '', confirm_password: '' }, resolver: zodResolver(formSchema) })

	async function resetPassword({ password, confirm_password }: TForm) {
		if (password !== confirm_password) return toast.error('Passwords do not match')

		const supabase = createClient()
		const { error } = await supabase.auth.updateUser({ password })
		if (error) return toast.error(error.message)

		toast.success('Password updated')
		return router.push('/')
	}

	return (
		<div className='w-screen h-screen'>
			<div className='w-full max-w-lg pt-20 mx-auto'>
				<Form {...form}>
					<form className='space-y-4' onSubmit={form.handleSubmit(resetPassword)}>
						<div className='flex items-end justify-between'>
							<h1 className='text-3xl font-bold tracking-tight text-primary'>Reset password</h1>
							<Link className={buttonVariants({ variant: 'secondary' })} href='/sign-in'>
								Sign in
							</Link>
						</div>
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
						<FormField
							control={form.control}
							name='confirm_password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm password</FormLabel>
									<FormControl>
										<Input type='password' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit'>Reset password</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}
