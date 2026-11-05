
create type public.app_role as enum ('admin','driver','passenger');
create type public.driver_status as enum ('pending','approved','rejected','suspended');
create type public.availability_status as enum ('online','offline','busy','unavailable');
create type public.ride_status as enum ('PENDING','QUOTED','ACCEPTED','CONFIRMED','DRIVER_ARRIVING','ARRIVED','IN_PROGRESS','COMPLETED','DECLINED','CANCELLED','EXPIRED');
create type public.pricing_mode as enum ('fixed','quote');
create type public.vehicle_category as enum ('economico','conforto','executivo','suv','van','acessivel');
create type public.document_type as enum ('cnh','crlv','antecedentes','comprovante_residencia','foto_perfil','outro');
create type public.review_status as enum ('pending','approved','rejected');

create table public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state char(2) not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (name, state)
);
grant select on public.cities to anon, authenticated;
grant all on public.cities to service_role;
alter table public.cities enable row level security;

create table public.service_areas (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  name text not null,
  active boolean not null default true,
  unique (city_id, name)
);
create index on public.service_areas(city_id);
grant select on public.service_areas to anon, authenticated;
grant all on public.service_areas to service_role;
alter table public.service_areas enable row level security;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  city_id uuid references public.cities(id),
  avatar_url text,
  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,
  suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.profiles to authenticated;
grant update (full_name, phone, city_id, avatar_url) on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create table public.passenger_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);
grant select on public.passenger_profiles to authenticated;
grant all on public.passenger_profiles to service_role;
alter table public.passenger_profiles enable row level security;

create table public.driver_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  status public.driver_status not null default 'pending',
  bio text,
  experience_years int check (experience_years is null or experience_years between 0 and 70),
  services text[] not null default '{}',
  pricing_mode public.pricing_mode not null default 'quote',
  base_fare numeric(10,2) check (base_fare is null or base_fare >= 0),
  price_per_km numeric(10,2) check (price_per_km is null or price_per_km >= 0),
  pricing_notes text,
  availability public.availability_status not null default 'offline',
  rating_avg numeric(3,2) not null default 0,
  rating_count int not null default 0,
  submitted_at timestamptz,
  approved_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.driver_profiles(status, availability);
grant select on public.driver_profiles to authenticated;
grant update (bio, experience_years, services, pricing_mode, base_fare, price_per_km, pricing_notes, availability) on public.driver_profiles to authenticated;
grant all on public.driver_profiles to service_role;
alter table public.driver_profiles enable row level security;

create table public.driver_private (
  driver_id uuid primary key references public.driver_profiles(id) on delete cascade,
  cpf text not null,
  cnh_number text not null,
  cnh_category text not null,
  updated_at timestamptz not null default now()
);
grant select on public.driver_private to authenticated;
grant update (cpf, cnh_number, cnh_category) on public.driver_private to authenticated;
grant all on public.driver_private to service_role;
alter table public.driver_private enable row level security;

create table public.driver_service_areas (
  driver_id uuid not null references public.driver_profiles(id) on delete cascade,
  area_id uuid not null references public.service_areas(id) on delete cascade,
  primary key (driver_id, area_id)
);
grant select, insert, delete on public.driver_service_areas to authenticated;
grant all on public.driver_service_areas to service_role;
alter table public.driver_service_areas enable row level security;

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.driver_profiles(id) on delete cascade,
  make text not null,
  model text not null,
  year int not null check (year between 1980 and 2100),
  color text not null,
  plate text not null,
  category public.vehicle_category not null default 'economico',
  seats int not null default 4 check (seats between 1 and 20),
  is_active boolean not null default true,
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (plate)
);
create index on public.vehicles(driver_id);
grant select, delete on public.vehicles to authenticated;
grant insert (driver_id, make, model, year, color, plate, category, seats, is_active) on public.vehicles to authenticated;
grant update (make, model, year, color, category, seats, is_active) on public.vehicles to authenticated;
grant all on public.vehicles to service_role;
alter table public.vehicles enable row level security;

create table public.driver_documents (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.driver_profiles(id) on delete cascade,
  doc_type public.document_type not null,
  file_path text not null,
  status public.review_status not null default 'pending',
  notes text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.driver_documents(driver_id);
grant select, delete on public.driver_documents to authenticated;
grant insert (driver_id, doc_type, file_path) on public.driver_documents to authenticated;
grant all on public.driver_documents to service_role;
alter table public.driver_documents enable row level security;

create table public.favorites (
  passenger_id uuid not null references public.passenger_profiles(id) on delete cascade,
  driver_id uuid not null references public.driver_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (passenger_id, driver_id)
);
create index on public.favorites(driver_id);
grant select, insert, delete on public.favorites to authenticated;
grant all on public.favorites to service_role;
alter table public.favorites enable row level security;

create table public.ride_requests (
  id uuid primary key default gen_random_uuid(),
  passenger_id uuid not null references public.passenger_profiles(id) on delete cascade,
  driver_id uuid not null references public.driver_profiles(id) on delete cascade,
  origin_address text not null,
  origin_lat double precision,
  origin_lng double precision,
  dest_address text not null,
  dest_lat double precision,
  dest_lng double precision,
  scheduled_for timestamptz,
  passengers int not null default 1 check (passengers between 1 and 20),
  luggage text,
  notes text,
  pricing_mode public.pricing_mode not null,
  quoted_price numeric(10,2),
  agreed_price numeric(10,2),
  status public.ride_status not null default 'PENDING',
  expires_at timestamptz not null,
  responded_at timestamptz,
  decline_reason text,
  cancelled_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.ride_requests(passenger_id, created_at desc);
create index on public.ride_requests(driver_id, created_at desc);
create index on public.ride_requests(status, expires_at);
grant select on public.ride_requests to authenticated;
grant all on public.ride_requests to service_role;
alter table public.ride_requests enable row level security;

create table public.ride_events (
  id uuid primary key default gen_random_uuid(),
  ride_request_id uuid not null references public.ride_requests(id) on delete cascade,
  actor_id uuid,
  from_status public.ride_status,
  to_status public.ride_status not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index on public.ride_events(ride_request_id, created_at);
grant select on public.ride_events to authenticated;
grant all on public.ride_events to service_role;
alter table public.ride_events enable row level security;

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  ride_request_id uuid not null unique references public.ride_requests(id) on delete cascade,
  passenger_id uuid not null references public.passenger_profiles(id) on delete cascade,
  driver_id uuid not null references public.driver_profiles(id) on delete cascade,
  score int not null check (score between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);
create index on public.ratings(driver_id, created_at desc);
grant select on public.ratings to authenticated;
grant all on public.ratings to service_role;
alter table public.ratings enable row level security;

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.notifications(user_id, created_at desc);
grant select, delete on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null,
  action text not null,
  target_table text not null,
  target_id uuid,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);
grant select on public.admin_audit_logs to authenticated;
grant all on public.admin_audit_logs to service_role;
alter table public.admin_audit_logs enable row level security;

create table public.platform_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
grant select on public.platform_settings to anon, authenticated;
grant all on public.platform_settings to service_role;
alter table public.platform_settings enable row level security;

create policy "cities public read" on public.cities for select to anon, authenticated using (true);
create policy "areas public read" on public.service_areas for select to anon, authenticated using (true);
create policy "settings public read" on public.platform_settings for select to anon, authenticated using (true);

create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "ride counterpart profile read" on public.profiles for select to authenticated using (
  exists (select 1 from public.ride_requests r where (r.passenger_id = auth.uid() and r.driver_id = profiles.id) or (r.driver_id = auth.uid() and r.passenger_id = profiles.id))
);
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "own roles read" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own passenger read" on public.passenger_profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own driver read" on public.driver_profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own driver update" on public.driver_profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "own private read" on public.driver_private for select to authenticated using (driver_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own private update" on public.driver_private for update to authenticated using (driver_id = auth.uid()) with check (driver_id = auth.uid());
create policy "own areas read" on public.driver_service_areas for select to authenticated using (driver_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own areas insert" on public.driver_service_areas for insert to authenticated with check (driver_id = auth.uid());
create policy "own areas delete" on public.driver_service_areas for delete to authenticated using (driver_id = auth.uid());
create policy "own vehicles read" on public.vehicles for select to authenticated using (driver_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own vehicles insert" on public.vehicles for insert to authenticated with check (driver_id = auth.uid());
create policy "own vehicles update" on public.vehicles for update to authenticated using (driver_id = auth.uid()) with check (driver_id = auth.uid());
create policy "own vehicles delete" on public.vehicles for delete to authenticated using (driver_id = auth.uid());
create policy "own docs read" on public.driver_documents for select to authenticated using (driver_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own docs insert" on public.driver_documents for insert to authenticated with check (driver_id = auth.uid());
create policy "own docs delete" on public.driver_documents for delete to authenticated using (driver_id = auth.uid() and status = 'pending');
create policy "own favorites read" on public.favorites for select to authenticated using (passenger_id = auth.uid());
create policy "own favorites insert" on public.favorites for insert to authenticated with check (passenger_id = auth.uid());
create policy "own favorites delete" on public.favorites for delete to authenticated using (passenger_id = auth.uid());
create policy "participants read rides" on public.ride_requests for select to authenticated using (passenger_id = auth.uid() or driver_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "participants read events" on public.ride_events for select to authenticated using (
  exists (select 1 from public.ride_requests r where r.id = ride_request_id and (r.passenger_id = auth.uid() or r.driver_id = auth.uid()))
  or public.has_role(auth.uid(),'admin')
);
create policy "ratings read" on public.ratings for select to authenticated using (passenger_id = auth.uid() or driver_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own notifications read" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "own notifications update" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own notifications delete" on public.notifications for delete to authenticated using (user_id = auth.uid());
create policy "admin audit read" on public.admin_audit_logs for select to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;
create trigger t_profiles_upd before update on public.profiles for each row execute function public.touch_updated_at();
create trigger t_driver_upd before update on public.driver_profiles for each row execute function public.touch_updated_at();
create trigger t_rides_upd before update on public.ride_requests for each row execute function public.touch_updated_at();

create or replace function public.guard_driver_availability() returns trigger language plpgsql set search_path = public as $$
begin
  if new.availability <> 'offline' and new.availability is distinct from old.availability then
    if new.status <> 'approved' or exists (select 1 from public.profiles p where p.id = new.id and p.suspended) then
      raise exception 'Motorista precisa estar aprovado para ficar disponível';
    end if;
  end if;
  if new.status <> 'approved' then new.availability = 'offline'; end if;
  return new;
end $$;
create trigger t_driver_avail before update on public.driver_profiles for each row execute function public.guard_driver_availability();

create or replace function public.notify_user(_user uuid, _type text, _title text, _body text, _link text)
returns void language sql security definer set search_path = public as $$
  insert into public.notifications(user_id, type, title, body, link) values (_user, _type, _title, _body, _link);
$$;
revoke execute on function public.notify_user(uuid,text,text,text,text) from public, anon, authenticated;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  r text := coalesce(m->>'role', 'passenger');
  c uuid;
begin
  begin c := nullif(m->>'city_id','')::uuid; exception when others then c := null; end;
  if c is not null and not exists (select 1 from public.cities where id = c) then c := null; end if;
  insert into public.profiles(id, full_name, phone, city_id, terms_accepted_at, privacy_accepted_at)
  values (new.id, coalesce(m->>'full_name', m->>'name', ''), m->>'phone', c,
          case when coalesce((m->>'terms_accepted')::boolean,false) then now() end,
          case when coalesce((m->>'privacy_accepted')::boolean,false) then now() end);
  if r = 'driver' then
    insert into public.user_roles(user_id, role) values (new.id, 'driver');
    insert into public.driver_profiles(id) values (new.id);
    insert into public.driver_private(driver_id, cpf, cnh_number, cnh_category)
    values (new.id, coalesce(m->>'cpf',''), coalesce(m->>'cnh_number',''), coalesce(m->>'cnh_category',''));
  else
    insert into public.user_roles(user_id, role) values (new.id, 'passenger');
    insert into public.passenger_profiles(id) values (new.id);
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.marketplace_drivers(
  p_city uuid default null, p_area uuid default null, p_available_only boolean default false,
  p_category public.vehicle_category default null, p_min_rating numeric default null,
  p_service text default null, p_query text default null, p_driver uuid default null)
returns table (
  driver_id uuid, full_name text, avatar_url text, city_id uuid, city_name text, city_state text,
  rating_avg numeric, rating_count int, availability public.availability_status,
  pricing_mode public.pricing_mode, base_fare numeric, price_per_km numeric, pricing_notes text,
  bio text, experience_years int, services text[],
  vehicle_make text, vehicle_model text, vehicle_year int, vehicle_color text,
  vehicle_category public.vehicle_category, vehicle_seats int, areas text[])
language sql stable security definer set search_path = public as $$
  select d.id, p.full_name, p.avatar_url, p.city_id, c.name, c.state::text,
    d.rating_avg, d.rating_count, d.availability, d.pricing_mode, d.base_fare, d.price_per_km, d.pricing_notes,
    d.bio, d.experience_years, d.services,
    v.make, v.model, v.year, v.color, v.category, v.seats,
    coalesce((select array_agg(sa.name order by sa.name) from public.driver_service_areas dsa join public.service_areas sa on sa.id = dsa.area_id where dsa.driver_id = d.id), '{}')
  from public.driver_profiles d
  join public.profiles p on p.id = d.id
  left join public.cities c on c.id = p.city_id
  left join lateral (select * from public.vehicles vv where vv.driver_id = d.id and vv.is_active order by vv.created_at desc limit 1) v on true
  where d.status = 'approved' and not p.suspended
    and (p_driver is null or d.id = p_driver)
    and (p_city is null or p.city_id = p_city)
    and (p_area is null or exists (select 1 from public.driver_service_areas x where x.driver_id = d.id and x.area_id = p_area))
    and (not p_available_only or d.availability = 'online')
    and (p_category is null or v.category = p_category)
    and (p_min_rating is null or d.rating_avg >= p_min_rating)
    and (p_service is null or p_service = any(d.services))
    and (p_query is null or p.full_name ilike '%' || p_query || '%' or v.model ilike '%' || p_query || '%')
  order by (d.availability = 'online') desc, d.rating_avg desc, p.full_name
$$;
grant execute on function public.marketplace_drivers to anon, authenticated;

create or replace function public.driver_public_ratings(p_driver uuid)
returns table (score int, comment text, created_at timestamptz, passenger_first_name text)
language sql stable security definer set search_path = public as $$
  select r.score, r.comment, r.created_at, split_part(p.full_name,' ',1)
  from public.ratings r join public.profiles p on p.id = r.passenger_id
  join public.driver_profiles d on d.id = r.driver_id and d.status = 'approved'
  where r.driver_id = p_driver order by r.created_at desc limit 50
$$;
grant execute on function public.driver_public_ratings to anon, authenticated;

create or replace function public.expire_ride_requests() returns int
language plpgsql security definer set search_path = public as $$
declare r record; n int := 0;
begin
  for r in update public.ride_requests set status = 'EXPIRED'
           where status = 'PENDING' and expires_at < now() returning id, passenger_id, driver_id loop
    insert into public.ride_events(ride_request_id, from_status, to_status) values (r.id, 'PENDING', 'EXPIRED');
    perform public.notify_user(r.passenger_id, 'ride_expired', 'Solicitação expirada', 'O motorista não respondeu a tempo. Você pode tentar novamente ou escolher outro motorista.', '/passageiro/viagens/' || r.id);
    n := n + 1;
  end loop;
  return n;
end $$;
revoke execute on function public.expire_ride_requests from public, anon;
grant execute on function public.expire_ride_requests to authenticated;

create or replace function public.create_ride_request(
  p_driver uuid, p_origin text, p_origin_lat double precision, p_origin_lng double precision,
  p_dest text, p_dest_lat double precision, p_dest_lng double precision,
  p_scheduled_for timestamptz, p_passengers int, p_luggage text, p_notes text)
returns uuid language plpgsql security definer set search_path = public as $$
declare d record; rid uuid; timeout int; pname text;
begin
  if auth.uid() is null then raise exception 'Não autenticado'; end if;
  if not exists (select 1 from public.passenger_profiles pp join public.profiles p on p.id = pp.id where pp.id = auth.uid() and not p.suspended) then
    raise exception 'Apenas passageiros ativos podem solicitar viagens';
  end if;
  if coalesce(trim(p_origin),'') = '' or coalesce(trim(p_dest),'') = '' then raise exception 'Informe origem e destino'; end if;
  select dp.*, pr.full_name, pr.suspended into d from public.driver_profiles dp join public.profiles pr on pr.id = dp.id where dp.id = p_driver;
  if not found or d.status <> 'approved' or d.suspended then raise exception 'Motorista indisponível na plataforma'; end if;
  if p_scheduled_for is null and d.availability <> 'online' then raise exception 'DRIVER_UNAVAILABLE'; end if;
  if p_scheduled_for is not null and p_scheduled_for < now() then raise exception 'A data agendada deve ser futura'; end if;
  perform public.expire_ride_requests();
  if exists (select 1 from public.ride_requests where passenger_id = auth.uid() and driver_id = p_driver and status = 'PENDING') then
    raise exception 'Você já tem uma solicitação pendente com este motorista';
  end if;
  select (value #>> '{}')::int into timeout from public.platform_settings where key = 'request_timeout_minutes';
  timeout := coalesce(timeout, 15);
  insert into public.ride_requests(passenger_id, driver_id, origin_address, origin_lat, origin_lng, dest_address, dest_lat, dest_lng,
    scheduled_for, passengers, luggage, notes, pricing_mode, expires_at)
  values (auth.uid(), p_driver, trim(p_origin), p_origin_lat, p_origin_lng, trim(p_dest), p_dest_lat, p_dest_lng,
    p_scheduled_for, coalesce(p_passengers,1), p_luggage, p_notes, d.pricing_mode, now() + make_interval(mins => timeout))
  returning id into rid;
  insert into public.ride_events(ride_request_id, actor_id, to_status) values (rid, auth.uid(), 'PENDING');
  select full_name into pname from public.profiles where id = auth.uid();
  perform public.notify_user(p_driver, 'ride_request', 'Nova solicitação de viagem', coalesce(nullif(pname,''),'Um passageiro') || ' escolheu você: ' || trim(p_origin) || ' → ' || trim(p_dest), '/painel-motorista/solicitacoes');
  return rid;
end $$;
revoke execute on function public.create_ride_request from public, anon;
grant execute on function public.create_ride_request to authenticated;

create or replace function public.driver_respond_ride(p_ride uuid, p_action text, p_price numeric default null, p_reason text default null)
returns public.ride_status language plpgsql security definer set search_path = public as $$
declare r record; new_status public.ride_status;
begin
  perform public.expire_ride_requests();
  select * into r from public.ride_requests where id = p_ride for update;
  if not found or r.driver_id <> auth.uid() then raise exception 'Solicitação não encontrada'; end if;
  if r.status <> 'PENDING' then raise exception 'Esta solicitação não está mais pendente (status: %)', r.status; end if;
  if p_price is not null and p_price <= 0 then raise exception 'Valor inválido'; end if;
  if p_action = 'decline' then
    new_status := 'DECLINED';
    update public.ride_requests set status = new_status, responded_at = now(), decline_reason = p_reason where id = p_ride;
    perform public.notify_user(r.passenger_id, 'ride_declined', 'Motorista recusou', 'Sua solicitação foi recusada. Escolha outro motorista ou tente agendar.', '/passageiro/viagens/' || p_ride);
  elsif p_action = 'quote' then
    if p_price is null then raise exception 'Informe o valor do orçamento'; end if;
    new_status := 'QUOTED';
    update public.ride_requests set status = new_status, responded_at = now(), quoted_price = p_price where id = p_ride;
    perform public.notify_user(r.passenger_id, 'ride_quoted', 'Orçamento recebido', 'O motorista enviou uma proposta de R$ ' || to_char(p_price,'FM999990D00') || '. Aceite para confirmar.', '/passageiro/viagens/' || p_ride);
  elsif p_action = 'accept' then
    if r.pricing_mode = 'quote' then raise exception 'Este motorista trabalha com orçamento: envie uma proposta'; end if;
    new_status := 'ACCEPTED';
    update public.ride_requests set status = new_status, responded_at = now(), quoted_price = coalesce(p_price, quoted_price) where id = p_ride;
    perform public.notify_user(r.passenger_id, 'ride_accepted', 'Solicitação aceita', 'O motorista aceitou sua viagem. Confirme para finalizar.', '/passageiro/viagens/' || p_ride);
  else
    raise exception 'Ação inválida';
  end if;
  insert into public.ride_events(ride_request_id, actor_id, from_status, to_status, payload)
  values (p_ride, auth.uid(), 'PENDING', new_status, jsonb_build_object('price', p_price, 'reason', p_reason));
  return new_status;
end $$;
revoke execute on function public.driver_respond_ride from public, anon;
grant execute on function public.driver_respond_ride to authenticated;

create or replace function public.passenger_confirm_ride(p_ride uuid)
returns void language plpgsql security definer set search_path = public as $$
declare r record;
begin
  select * into r from public.ride_requests where id = p_ride for update;
  if not found or r.passenger_id <> auth.uid() then raise exception 'Solicitação não encontrada'; end if;
  if r.status not in ('QUOTED','ACCEPTED') then raise exception 'Não é possível confirmar neste status'; end if;
  update public.ride_requests set status = 'CONFIRMED', agreed_price = r.quoted_price where id = p_ride;
  insert into public.ride_events(ride_request_id, actor_id, from_status, to_status, payload) values (p_ride, auth.uid(), r.status, 'CONFIRMED', jsonb_build_object('agreed_price', r.quoted_price));
  perform public.notify_user(r.driver_id, 'ride_confirmed', 'Viagem confirmada', 'O passageiro confirmou a viagem.', '/painel-motorista/solicitacoes');
end $$;
revoke execute on function public.passenger_confirm_ride from public, anon;
grant execute on function public.passenger_confirm_ride to authenticated;

create or replace function public.cancel_ride(p_ride uuid, p_reason text default null)
returns void language plpgsql security definer set search_path = public as $$
declare r record; other uuid;
begin
  select * into r from public.ride_requests where id = p_ride for update;
  if not found or (r.passenger_id <> auth.uid() and r.driver_id <> auth.uid()) then raise exception 'Solicitação não encontrada'; end if;
  if r.status not in ('PENDING','QUOTED','ACCEPTED','CONFIRMED','DRIVER_ARRIVING','ARRIVED') then raise exception 'Não é possível cancelar neste status'; end if;
  if r.driver_id = auth.uid() and r.status = 'PENDING' then raise exception 'Use recusar para solicitações pendentes'; end if;
  update public.ride_requests set status = 'CANCELLED', cancelled_by = auth.uid(), decline_reason = coalesce(p_reason, decline_reason) where id = p_ride;
  insert into public.ride_events(ride_request_id, actor_id, from_status, to_status, payload) values (p_ride, auth.uid(), r.status, 'CANCELLED', jsonb_build_object('reason', p_reason));
  other := case when auth.uid() = r.passenger_id then r.driver_id else r.passenger_id end;
  perform public.notify_user(other, 'ride_cancelled', 'Viagem cancelada', coalesce(p_reason, 'A viagem foi cancelada.'),
    case when other = r.passenger_id then '/passageiro/viagens/' || p_ride else '/painel-motorista/solicitacoes' end);
end $$;
revoke execute on function public.cancel_ride from public, anon;
grant execute on function public.cancel_ride to authenticated;

create or replace function public.driver_advance_ride(p_ride uuid, p_to public.ride_status)
returns void language plpgsql security definer set search_path = public as $$
declare r record; ok boolean;
begin
  select * into r from public.ride_requests where id = p_ride for update;
  if not found or r.driver_id <> auth.uid() then raise exception 'Solicitação não encontrada'; end if;
  ok := (r.status = 'CONFIRMED' and p_to = 'DRIVER_ARRIVING') or (r.status = 'DRIVER_ARRIVING' and p_to = 'ARRIVED')
     or (r.status = 'ARRIVED' and p_to = 'IN_PROGRESS') or (r.status = 'IN_PROGRESS' and p_to = 'COMPLETED');
  if not ok then raise exception 'Transição inválida: % → %', r.status, p_to; end if;
  update public.ride_requests set status = p_to where id = p_ride;
  insert into public.ride_events(ride_request_id, actor_id, from_status, to_status) values (p_ride, auth.uid(), r.status, p_to);
  if p_to = 'IN_PROGRESS' then update public.driver_profiles set availability = 'busy' where id = r.driver_id; end if;
  if p_to = 'COMPLETED' then update public.driver_profiles set availability = 'online' where id = r.driver_id and availability = 'busy'; end if;
  perform public.notify_user(r.passenger_id, 'ride_status', 'Atualização da viagem',
    case p_to when 'DRIVER_ARRIVING' then 'O motorista está a caminho.' when 'ARRIVED' then 'O motorista chegou ao local de embarque.'
      when 'IN_PROGRESS' then 'Viagem iniciada.' else 'Viagem concluída. Avalie seu motorista!' end, '/passageiro/viagens/' || p_ride);
end $$;
revoke execute on function public.driver_advance_ride from public, anon;
grant execute on function public.driver_advance_ride to authenticated;

create or replace function public.rate_ride(p_ride uuid, p_score int, p_comment text default null)
returns void language plpgsql security definer set search_path = public as $$
declare r record;
begin
  select * into r from public.ride_requests where id = p_ride;
  if not found or r.passenger_id <> auth.uid() then raise exception 'Solicitação não encontrada'; end if;
  if r.status <> 'COMPLETED' then raise exception 'Só é possível avaliar viagens concluídas'; end if;
  if p_score not between 1 and 5 then raise exception 'Nota inválida'; end if;
  insert into public.ratings(ride_request_id, passenger_id, driver_id, score, comment) values (p_ride, r.passenger_id, r.driver_id, p_score, p_comment);
  update public.driver_profiles d set rating_avg = s.avg, rating_count = s.cnt
  from (select avg(score)::numeric(3,2) avg, count(*)::int cnt from public.ratings where driver_id = r.driver_id) s where d.id = r.driver_id;
end $$;
revoke execute on function public.rate_ride from public, anon;
grant execute on function public.rate_ride to authenticated;

create or replace function public.submit_driver_for_review() returns void
language plpgsql security definer set search_path = public as $$
declare a record;
begin
  if not exists (select 1 from public.driver_profiles where id = auth.uid()) then raise exception 'Perfil de motorista não encontrado'; end if;
  if not exists (select 1 from public.vehicles where driver_id = auth.uid()) then raise exception 'Cadastre ao menos um veículo'; end if;
  if not exists (select 1 from public.driver_documents where driver_id = auth.uid() and doc_type = 'cnh') then raise exception 'Envie a foto da CNH'; end if;
  if exists (select 1 from public.driver_private where driver_id = auth.uid() and (cpf = '' or cnh_number = '' or cnh_category = '')) then raise exception 'Complete CPF e dados da CNH'; end if;
  update public.driver_profiles set submitted_at = now(), status = case when status = 'rejected' then 'pending'::public.driver_status else status end, rejection_reason = null where id = auth.uid();
  for a in select user_id from public.user_roles where role = 'admin' loop
    perform public.notify_user(a.user_id, 'driver_submitted', 'Motorista aguardando aprovação', 'Um motorista enviou o cadastro para análise.', '/admin/motoristas');
  end loop;
end $$;
revoke execute on function public.submit_driver_for_review from public, anon;
grant execute on function public.submit_driver_for_review to authenticated;

create or replace function public.admin_review_driver(p_driver uuid, p_status public.driver_status, p_reason text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(),'admin') then raise exception 'Acesso negado'; end if;
  update public.driver_profiles set status = p_status,
    approved_at = case when p_status = 'approved' then now() else approved_at end,
    rejection_reason = case when p_status in ('rejected','suspended') then p_reason else null end
  where id = p_driver;
  if not found then raise exception 'Motorista não encontrado'; end if;
  if p_status = 'approved' then
    update public.vehicles set status = 'approved' where driver_id = p_driver and status = 'pending';
    update public.driver_documents set status = 'approved', reviewed_at = now() where driver_id = p_driver and status = 'pending';
  end if;
  insert into public.admin_audit_logs(admin_id, action, target_table, target_id, details) values (auth.uid(), 'driver_' || p_status, 'driver_profiles', p_driver, jsonb_build_object('reason', p_reason));
  perform public.notify_user(p_driver, 'driver_review',
    case p_status when 'approved' then 'Cadastro aprovado!' when 'rejected' then 'Cadastro não aprovado' when 'suspended' then 'Conta suspensa' else 'Cadastro em análise' end,
    coalesce(p_reason, case when p_status = 'approved' then 'Você já pode ficar disponível e receber solicitações.' else null end), '/painel-motorista');
end $$;
revoke execute on function public.admin_review_driver from public, anon;
grant execute on function public.admin_review_driver to authenticated;

create or replace function public.admin_set_user_suspended(p_user uuid, p_suspended boolean, p_reason text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(),'admin') then raise exception 'Acesso negado'; end if;
  if p_user = auth.uid() then raise exception 'Você não pode suspender a si mesmo'; end if;
  update public.profiles set suspended = p_suspended where id = p_user;
  if p_suspended then update public.driver_profiles set availability = 'offline' where id = p_user; end if;
  insert into public.admin_audit_logs(admin_id, action, target_table, target_id, details) values (auth.uid(), case when p_suspended then 'user_suspended' else 'user_reactivated' end, 'profiles', p_user, jsonb_build_object('reason', p_reason));
end $$;
revoke execute on function public.admin_set_user_suspended from public, anon;
grant execute on function public.admin_set_user_suspended to authenticated;

create or replace function public.admin_review_document(p_doc uuid, p_status public.review_status, p_notes text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(),'admin') then raise exception 'Acesso negado'; end if;
  update public.driver_documents set status = p_status, notes = p_notes, reviewed_at = now() where id = p_doc;
  insert into public.admin_audit_logs(admin_id, action, target_table, target_id, details) values (auth.uid(), 'document_' || p_status, 'driver_documents', p_doc, jsonb_build_object('notes', p_notes));
end $$;
revoke execute on function public.admin_review_document from public, anon;
grant execute on function public.admin_review_document to authenticated;

create or replace function public.admin_list_users()
returns table (id uuid, full_name text, phone text, email text, city_name text, roles text[], suspended boolean, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(),'admin') then raise exception 'Acesso negado'; end if;
  return query select p.id, p.full_name, p.phone, u.email::text, c.name,
    array(select ur.role::text from public.user_roles ur where ur.user_id = p.id), p.suspended, p.created_at
  from public.profiles p join auth.users u on u.id = p.id left join public.cities c on c.id = p.city_id
  order by p.created_at desc limit 500;
end $$;
revoke execute on function public.admin_list_users from public, anon;
grant execute on function public.admin_list_users to authenticated;

create or replace function public.admin_upsert_city(p_name text, p_state text, p_active boolean default true)
returns uuid language plpgsql security definer set search_path = public as $$
declare cid uuid;
begin
  if not public.has_role(auth.uid(),'admin') then raise exception 'Acesso negado'; end if;
  insert into public.cities(name, state, active) values (trim(p_name), upper(p_state), p_active)
  on conflict (name, state) do update set active = excluded.active returning id into cid;
  insert into public.admin_audit_logs(admin_id, action, target_table, target_id) values (auth.uid(), 'city_upsert', 'cities', cid);
  return cid;
end $$;
revoke execute on function public.admin_upsert_city from public, anon;
grant execute on function public.admin_upsert_city to authenticated;

create or replace function public.admin_add_area(p_city uuid, p_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare aid uuid;
begin
  if not public.has_role(auth.uid(),'admin') then raise exception 'Acesso negado'; end if;
  insert into public.service_areas(city_id, name) values (p_city, trim(p_name)) on conflict (city_id, name) do update set active = true returning id into aid;
  insert into public.admin_audit_logs(admin_id, action, target_table, target_id) values (auth.uid(), 'area_upsert', 'service_areas', aid);
  return aid;
end $$;
revoke execute on function public.admin_add_area from public, anon;
grant execute on function public.admin_add_area to authenticated;

create or replace function public.admin_set_setting(p_key text, p_value jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(),'admin') then raise exception 'Acesso negado'; end if;
  insert into public.platform_settings(key, value) values (p_key, p_value) on conflict (key) do update set value = excluded.value, updated_at = now();
  insert into public.admin_audit_logs(admin_id, action, target_table, details) values (auth.uid(), 'setting_update', 'platform_settings', jsonb_build_object('key', p_key, 'value', p_value));
end $$;
revoke execute on function public.admin_set_setting from public, anon;
grant execute on function public.admin_set_setting to authenticated;

alter publication supabase_realtime add table public.ride_requests;
alter publication supabase_realtime add table public.notifications;

create policy "driver docs owner upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'driver-documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "driver docs owner or admin read" on storage.objects for select to authenticated
  using (bucket_id = 'driver-documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.has_role(auth.uid(),'admin')));
create policy "driver docs owner delete" on storage.objects for delete to authenticated
  using (bucket_id = 'driver-documents' and (storage.foldername(name))[1] = auth.uid()::text);

insert into public.cities(name, state) values ('Juiz de Fora', 'MG');
insert into public.service_areas(city_id, name)
select c.id, a from public.cities c, unnest(array['Centro','São Mateus','Cascatinha','Alto dos Passos','Granbery','Bom Pastor','São Pedro','Benfica','Santa Luzia','Manoel Honório','Jardim Glória','Bairu']) a
where c.name = 'Juiz de Fora';
insert into public.platform_settings(key, value) values ('request_timeout_minutes', '15'::jsonb);
