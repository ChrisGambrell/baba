'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

const formSchema = z.object({ first_name: z.string().min(1), last_name: z.string().min(1) })
type TForm = z.infer<typeof formSchema>

export default function ProfileForm({ profile }: { profile: Profile }) {
	const router = useRouter()
	const form = useForm<TForm>({ defaultValues: profile, resolver: zodResolver(formSchema) })

	async function updateProfile(formData: TForm) {
		const supabase = createClient()

		const { error } = await supabase.from('profiles').update(formData).eq('id', profile.id)
		if (error) return toast.error(error.message)

		toast.success('Profile updated')
		return router.refresh()
	}

	return (
		<Form {...form}>
			<form className='space-y-4' onSubmit={form.handleSubmit(updateProfile)}>
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
				<Button type='submit'>Update profile</Button>
			</form>
		</Form>
	)
}
