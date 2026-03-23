import { connection } from "next/server";
import Image from "next/image";

import { MemberForm } from "@/components/membros/member-form";
import { loadCelulaOptions } from "@/lib/mapeamento/celulas";

export default async function Home() {
  await connection();

  const { celulas, loadError } = await loadCelulaOptions();

  return (
    <main className="min-h-screen bg-[#F9F9FD] text-[#1A1C1F]">
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

      <div className="mx-auto w-full max-w-[816px] px-4 py-8 sm:px-6 sm:py-10">
        <MemberForm celulas={celulas} loadError={loadError} />
      </div>
    </main>
  );
}
