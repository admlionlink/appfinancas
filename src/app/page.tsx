import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Download,
  Filter,
  PiggyBank,
  Shield,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PiggyBank className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">FinançasPessoais</span>
          </Link>
          <nav className="flex items-center gap-2">
            {user ? (
              <Button asChild>
                <Link href="/dashboard">Acessar dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link href="/cadastro">Criar conta</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border bg-muted/40 px-4 py-1.5 text-sm">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-success" />
              Gestão financeira pessoal, simples e visual
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Controle suas finanças <br />
              <span className="text-primary">sem complicação</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Registre receitas e despesas, organize por categorias e visualize tudo em
              um dashboard limpo. Tenha clareza total sobre seu dinheiro.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={user ? "/dashboard" : "/cadastro"}>
                  Começar gratuitamente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Tudo que você precisa em um só lugar
              </h2>
              <p className="mt-4 text-muted-foreground">
                Funcionalidades pensadas para deixar o controle financeiro acessível.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Wallet className="h-5 w-5" />}
                title="Receitas e despesas"
                description="Cadastre suas transações em segundos e mantenha o histórico completo."
              />
              <FeatureCard
                icon={<BarChart3 className="h-5 w-5" />}
                title="Dashboard visual"
                description="Gráficos de pizza por categoria e cards com totais do mês."
              />
              <FeatureCard
                icon={<Filter className="h-5 w-5" />}
                title="Filtros e busca"
                description="Filtre por mês, categoria ou pesquise por descrição."
              />
              <FeatureCard
                icon={<Download className="h-5 w-5" />}
                title="Exporte para CSV"
                description="Baixe seus dados em qualquer momento, sem trava."
              />
              <FeatureCard
                icon={<Shield className="h-5 w-5" />}
                title="Privacidade primeiro"
                description="Cada usuário enxerga apenas as próprias transações (RLS no Supabase)."
              />
              <FeatureCard
                icon={<PiggyBank className="h-5 w-5" />}
                title="Categorias prontas"
                description="Alimentação, transporte, moradia, lazer, salário e muito mais."
              />
            </div>
          </div>
        </section>

        <section className="container py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Pronto para organizar seu mês?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Crie sua conta agora e dê o primeiro passo para uma vida financeira mais
              tranquila.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href={user ? "/dashboard" : "/cadastro"}>
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FinançasPessoais — Construído com Next.js, Supabase
          e shadcn/ui
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
