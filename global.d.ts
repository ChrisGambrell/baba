import { Database as TDatabase } from '@/lib/supabase/db.types'

declare global {
	type Database = TDatabase
	type Row<T extends keyof Database['public']['Tables']> = TDatabase['public']['Tables'][T]['Row']

	type Profile = Row<'profiles'>
}
