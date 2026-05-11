# FinançasPessoais

App de gestão financeira pessoal: registre receitas e despesas, organize por categorias, visualize um dashboard com gráficos e exporte tudo em CSV.

Construído com **Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Supabase (Auth + PostgreSQL + RLS) + Recharts**.

## Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui, Recharts, lucide-react
- **Backend / BaaS**: Supabase (Auth + Postgres + Row Level Security)
- **Validação**: Zod
- **Deploy**: Vercel (CI/CD via GitHub)

## Funcionalidades

- Login e cadastro com e-mail/senha (Supabase Auth)
- Rotas protegidas via middleware do Next.js
- Dashboard com cards (Receitas, Despesas, Saldo) e gráfico de pizza por categoria
- CRUD completo de transações (criar / editar / excluir)
- Categorias pré-definidas (Salário, Freelance, Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Investimentos, Outros)
- Filtros por mês, tipo (receita/despesa) e categoria + busca por descrição
- Exportação das transações filtradas em CSV
- Layout responsivo (mobile e desktop)
- RLS no Supabase: cada usuário só vê as próprias transações

## Como rodar localmente

### 1. Pré-requisitos

- Node.js 18.18+ (recomendado 20+)
- Conta no [Supabase](https://supabase.com)

### 2. Clone e instale dependências

```bash
npm install
```

### 3. Configure o Supabase

1. Crie um novo projeto em https://supabase.com/dashboard
2. No painel do projeto, abra **SQL Editor** e cole/execute o conteúdo do arquivo [`supabase/schema.sql`](supabase/schema.sql)
3. Em **Authentication → Providers**, mantenha "Email" habilitado. Para acelerar o teste local, desabilite "Confirm email" em **Authentication → Settings**.
4. Copie a URL do projeto e a chave `anon` em **Settings → API**.

### 4. Variáveis de ambiente

Crie um arquivo `.env.local` na raiz com base no `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### 5. Rode o servidor de desenvolvimento

```bash
npm run dev
```

Abra http://localhost:3000.

## Estrutura do projeto

```
src/
├── app/
│   ├── (auth)/              # Rotas públicas de autenticação
│   │   ├── login/
│   │   └── cadastro/
│   ├── (app)/               # Rotas autenticadas
│   │   ├── dashboard/
│   │   └── transacoes/
│   ├── auth/signout/        # Route handler para logout
│   ├── layout.tsx
│   ├── page.tsx             # Landing page
│   └── globals.css
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   ├── dashboard/           # Cards, gráfico, seletor de mês
│   └── app-shell.tsx        # Layout (header + nav) do app
├── lib/
│   ├── supabase/            # Clients (browser, server, middleware)
│   ├── categories.ts
│   ├── csv.ts
│   ├── months.ts
│   ├── types.ts
│   └── utils.ts
├── hooks/
│   └── use-toast.ts
└── middleware.ts            # Proteção de rotas

supabase/
└── schema.sql               # Tabela + RLS + triggers
```

## Deploy na Vercel

1. Faça push do projeto para um repositório no GitHub
2. Importe o repositório em https://vercel.com/new
3. Adicione as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Em **Authentication → URL Configuration** no Supabase, adicione a URL da Vercel em "Site URL" e "Redirect URLs"
5. Deploy

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — inicia o servidor de produção
- `npm run lint` — análise estática com ESLint

## Próximos passos

- Metas mensais por categoria
- Transações recorrentes (assinaturas, salários)
- Visão anual com comparativo mês a mês
- Suporte a múltiplas contas/carteiras
- Tema escuro
