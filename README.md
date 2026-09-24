# Painel — Mineiro, o Barbeiro

Site + painel de retorno de clientes para a barbearia Mineiro, o Barbeiro
(Piracicaba-SP). Feito para o Douglas operar sozinho pelo celular depois de
pronto.

- `/` — landing page pública (oferta, serviços, WhatsApp)
- `/painel` — lista de clientes com destaque de quem está no momento de
  voltar, protegida por senha única
- `/painel/novo` — registrar um atendimento (cadastra o cliente na primeira
  vez, só adiciona a visita depois)
- `/painel/conteudo` — checklist semanal de conteúdo (Fase 3)

## Rodar localmente

```bash
npm install
cp .env.local.example .env.local   # depois preencha as variáveis, veja abaixo
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

## Configurar o banco (Supabase — plano free)

1. Crie uma conta em [supabase.com](https://supabase.com) e um novo projeto
   (free tier já é suficiente pro volume da barbearia).
2. Em **SQL Editor**, cole e rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql).
   Isso cria as tabelas `clientes`, `atendimentos` e `conteudo_semana`.
3. Em **Project Settings > Data API**, copie a **Project URL** →
   `SUPABASE_URL`.
4. Em **Project Settings > API Keys**, copie a chave **service_role**
   (não a `anon`) → `SUPABASE_SERVICE_ROLE_KEY`. Essa chave é secreta — só
   fica no servidor, nunca no navegador.

## Variáveis de ambiente

Preencha `.env.local` (local) e, depois do deploy, as mesmas variáveis nas
configurações do projeto na Vercel:

| Variável                     | O que é                                                |
| ----------------------------- | ------------------------------------------------------- |
| `SUPABASE_URL`                 | URL do projeto Supabase                                 |
| `SUPABASE_SERVICE_ROLE_KEY`    | Chave secreta do Supabase (service_role)                |
| `PAINEL_SENHA`                 | Senha única que o Douglas usa para entrar no `/painel`   |
| `SESSION_SECRET`               | Qualquer string aleatória longa (ex: `openssl rand -hex 32`) |

## Deploy (Vercel — plano free)

1. Suba este projeto para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. Antes do primeiro deploy, adicione as 4 variáveis de ambiente acima em
   **Environment Variables**.
4. Deploy. O link público (`algo.vercel.app`) já serve a landing em `/` sem
   exigir login — o login só é pedido em `/painel`.

## Estrutura de dados

- **clientes**: um registro por pessoa (nome, whatsapp, origem/campanha).
- **atendimentos**: um registro por visita (data, serviço). O status de
  retorno de cada cliente é calculado a partir da visita mais recente:
  - **< 20 dias**: em dia
  - **20–24 dias**: chegando perto
  - **25–30 dias**: momento ideal de voltar (destaque forte)
  - **31+ dias**: atrasado

O botão "Enviar lembrete" abre o WhatsApp Web/app com uma mensagem pronta —
o envio final é sempre uma confirmação manual do Douglas, não é automático.
