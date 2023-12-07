create table public.profiles (
    id uuid not null references auth.users on delete cascade,
    first_name text not null,
    last_name text not null,

    primary key (id)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
    on public.profiles for select
    using (true);

create policy "Users can update own profile."
    on public.profiles for update
    using (auth.uid() = id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, first_name, last_name)
    values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();