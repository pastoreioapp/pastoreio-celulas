"use client";

import { useState } from "react";

type MemberSelfRegisterShareProps = {
  href: string;
};

export function MemberSelfRegisterShare({
  href,
}: MemberSelfRegisterShareProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopyLink() {
    try {
      const absoluteUrl = new URL(href, window.location.origin).toString();
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-[20px] border border-[#C9D4E9] border-l-[3px] border-l-brand bg-[#F0F4FE] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xl leading-none" aria-hidden="true">🔗</span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-badge-text">
            Compartilhe o link da sua célula
          </h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Use este link para que o próprio membro preencha os dados diretamente na
            célula correta, sem poder alterá-la.
          </p>

          <div className="mt-4 rounded-xl border border-badge-bg bg-white/70 p-3 sm:p-4">
            <p className="break-all text-sm font-medium text-text-primary">
              {href}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void handleCopyLink()}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-dark px-5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#2D4E8A]"
            >
              {copied ? "Link copiado" : "Copiar link"}
            </button>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-brand px-5 text-sm font-bold uppercase tracking-widest text-brand-dark transition hover:bg-[#E2EAFF]"
            >
              Abrir link
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
