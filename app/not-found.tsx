import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F9F9FD] text-text-primary">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#F9F9FD]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[816px] items-center justify-center px-6 py-4">
          <Image
            src="/figma/pastoreio-logo.png"
            alt="Pastore.io"
            width={320}
            height={70}
            priority
            className="h-11 w-auto sm:h-14"
          />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[816px] flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <span className="font-heading text-6xl font-extrabold tracking-[-0.04em] text-brand sm:text-8xl">
          404
        </span>

        <h1 className="mt-4 font-heading text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
          Página não encontrada
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary">
          O endereço que você tentou acessar não existe ou foi movido. Verifique
          o código de acesso e tente novamente.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand-dark px-6 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#2D4E8A]"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
