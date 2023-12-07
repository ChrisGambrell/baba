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

const formSchema = z.object({ email: z.string().email() })
type TForm = z.infer<typeof formSchema>

export default function AccountRecovery() {
	const router = useRouter()
	const form = useForm<TForm>({ defaultValues: { email: '' }, resolver: zodResolver(formSchema) })

	async function recoverAccount({ email }: TForm) {
		const supabase = createClient()

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN_URL}/reset-password`,
		})
		if (error) return toast.error(error.message)

		toast.success('Check email to continue recovery process')
		return router.push('/sign-in')
	}

	return (
		<Form {...form}>
			<form className='space-y-4' onSubmit={form.handleSubmit(recoverAccount)}>
				<h1 className='text-3xl font-bold tracking-tight text-primary'>Account recovery</h1>
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
				<div className='flex items-center justify-between'>
					<Button type='submit'>Recover account</Button>
					<Link className={buttonVariants({ variant: 'link' })} href='/sign-in'>
						Back to sign in
					</Link>
				</div>
			</form>
		</Form>
	)
}
