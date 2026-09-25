-- Rode este script inteiro no SQL Editor do Supabase (Project > SQL Editor > New query).
-- Ele cria as 3 tabelas usadas pelo painel. Só a Service Role Key do servidor
-- acessa essas tabelas (RLS fica ligado e sem policies = ninguém acessa direto
-- pelo navegador, só através do nosso próprio backend).

create extension if not exists "pgcrypto";

create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null unique,
  origem text,
  created_at timestamptz not null default now()
);

create table if not exists atendimentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  data date not null,
  servico text not null,
  created_at timestamptz not null default now()
);
create index if not exists atendimentos_cliente_id_idx on atendimentos(cliente_id);
create index if not exists atendimentos_data_idx on atendimentos(data);

create table if not exists conteudo_semana (
  id uuid primary key default gen_random_uuid(),
  semana date not null, -- segunda-feira da semana
  item text not null,   -- 'antes_depois_1' | 'antes_depois_2' | 'antes_depois_3' | 'bastidores' | 'dica'
  feito boolean not null default false,
  unique(semana, item)
);

create table if not exists eventos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null, -- 'view' (visita na landing) | 'click_whatsapp'
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz not null default now()
);
create index if not exists eventos_created_at_idx on eventos(created_at);
create index if not exists eventos_tipo_idx on eventos(tipo);

-- Preencher Agenda: cada "disparo" de uma oferta (uma execução) agrupa os
-- envios individuais confirmados por Douglas.
create table if not exists campanhas_execucoes (
  id uuid primary key default gen_random_uuid(),
  campanha_nome text not null,
  campanha_mensagem text not null,
  data_alvo date not null,
  qtd_selecionados integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists campanhas_envios (
  id uuid primary key default gen_random_uuid(),
  execucao_id uuid not null references campanhas_execucoes(id) on delete cascade,
  cliente_id uuid not null references clientes(id) on delete cascade,
  -- respondeu / agendou podem ser adicionados depois sem quebrar nada;
  -- de propósito não construímos UI pra isso ainda.
  created_at timestamptz not null default now()
);
create index if not exists campanhas_envios_cliente_id_idx on campanhas_envios(cliente_id);
create index if not exists campanhas_envios_execucao_id_idx on campanhas_envios(execucao_id);

alter table clientes enable row level security;
alter table atendimentos enable row level security;
alter table conteudo_semana enable row level security;
alter table eventos enable row level security;
alter table campanhas_execucoes enable row level security;
alter table campanhas_envios enable row level security;

grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
