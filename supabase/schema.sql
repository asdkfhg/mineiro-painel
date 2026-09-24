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

alter table clientes enable row level security;
alter table atendimentos enable row level security;
alter table conteudo_semana enable row level security;
