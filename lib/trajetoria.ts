import type { CelulaRanking } from "@/lib/types";

export enum PassoTrajetoria {
  // PASTOREIO 01
  ASSIDUO_CULTO = "Assíduo no Culto",
  ASSIDUO_CELULA = "Assíduo na Célula/Life",
  LIVRO_ACOMPANHAMENTO = "Livro Acompanhamento Inicial",
  CAFE_PASTOR = "Café com Pastor",
  ESTACAO_DNA = "Estação DNA",
  CURSO_NOVA_CRIATURA = "Curso Nova Criatura",
  BATISMO = "Batismo nas águas",

  // PASTOREIO 02
  CURSO_VIDA_DEVOCIONAL = "Curso Vida Devocional",
  CURSO_AUTORIDADE_SUBMISSAO = "Curso Autoridade e Submissão",
  CURSO_FAMILIA_CRISTIA = "Curso Família Cristã",
  SERVIR_MINISTERIO = "Servir em algum ministério",
  ENCONTRO_DEUS = "Encontro com Deus",

  // DISCIPULADO
  ASSIDUO_TADEL = "Assíduo no Tadel",
  CURSO_IDE_FAZEI_DISCIPULOS = "Curso Ide e Fazei Discípulos",
  EXPRESSO_01 = "Expresso 01",

  // LÍDER DE CÉLULA
  CURSO_TREINAMENTO_LIDERES = "Curso Treinamento de Líderes de Lifes",
  EXPRESSO_02 = "Expresso 02",
  VIDA_CRISTA_EXEMPLAR = "Vida Cristã Exemplar",
  APROVACAO_PASTOR = "Aprovação do Pastor de Rede",
}

export const CategoriasTrajetoria = {
  "PASTOREIO 01": [
    PassoTrajetoria.ASSIDUO_CULTO,
    PassoTrajetoria.ASSIDUO_CELULA,
    PassoTrajetoria.LIVRO_ACOMPANHAMENTO,
    PassoTrajetoria.CAFE_PASTOR,
    PassoTrajetoria.ESTACAO_DNA,
    PassoTrajetoria.CURSO_NOVA_CRIATURA,
    PassoTrajetoria.BATISMO,
  ],
  "PASTOREIO 02": [
    PassoTrajetoria.CURSO_VIDA_DEVOCIONAL,
    PassoTrajetoria.CURSO_AUTORIDADE_SUBMISSAO,
    PassoTrajetoria.CURSO_FAMILIA_CRISTIA,
    PassoTrajetoria.SERVIR_MINISTERIO,
    PassoTrajetoria.ENCONTRO_DEUS,
  ],
  DISCIPULADO: [
    PassoTrajetoria.ASSIDUO_TADEL,
    PassoTrajetoria.CURSO_IDE_FAZEI_DISCIPULOS,
    PassoTrajetoria.EXPRESSO_01,
  ],
  "LÍDER DE CÉLULA": [
    PassoTrajetoria.CURSO_TREINAMENTO_LIDERES,
    PassoTrajetoria.EXPRESSO_02,
    PassoTrajetoria.VIDA_CRISTA_EXEMPLAR,
    PassoTrajetoria.APROVACAO_PASTOR,
  ],
} as const satisfies Record<string, readonly PassoTrajetoria[]>;

export type CategoriaTrajetoria = keyof typeof CategoriasTrajetoria;

export const CategoriaTrajetoriaDescriptions: Record<
  CategoriaTrajetoria,
  string
> = {
  "PASTOREIO 01": "",
  "PASTOREIO 02": "",
  "DISCIPULADO": "",
  "LÍDER DE CÉLULA": "",
};

export const TodosPassosTrajetoria = Object.values(PassoTrajetoria);
export const TotalCategoriasTrajetoria =
  Object.keys(CategoriasTrajetoria).length;
export const TotalPassosTrajetoria = TodosPassosTrajetoria.length;
export const CategoriasTrajetoriaEntries = Object.entries(
  CategoriasTrajetoria
) as [CategoriaTrajetoria, readonly PassoTrajetoria[]][];

export function computeCelulaRankings(
  celulas: { id: string; nome: string }[],
  members: { celulaId: string | null; passosConcluidos: PassoTrajetoria[] }[]
): CelulaRanking[] {
  const membersByCelula = new Map<string, typeof members>();

  for (const member of members) {
    if (!member.celulaId) continue;
    const list = membersByCelula.get(member.celulaId) ?? [];
    list.push(member);
    membersByCelula.set(member.celulaId, list);
  }

  const rankings = celulas.map((celula) => {
    const celulaMembers = membersByCelula.get(celula.id) ?? [];
    const completedSteps = celulaMembers.reduce(
      (sum, m) => sum + m.passosConcluidos.length,
      0
    );
    const totalSteps = celulaMembers.length * TotalPassosTrajetoria;

    return {
      id: celula.id,
      nome: celula.nome,
      memberCount: celulaMembers.length,
      completedSteps,
      totalSteps,
      percentage:
        totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
    };
  });

  rankings.sort((a, b) => b.percentage - a.percentage || b.memberCount - a.memberCount);

  return rankings;
}

export function computeTrajectoryInsights(
  members: {
    passosConcluidos: PassoTrajetoria[];
    discipuladorNome: string | null;
    ministerios: string[];
  }[]
) {
  const totalMembers = members.length;

  if (totalMembers === 0) {
    return {
      totalMembers: 0,
      totalCompletedSteps: 0,
      totalPossibleSteps: 0,
      overallPercentage: 0,
      membersWithFullTrajectory: 0,
      membersWithDiscipulador: 0,
      membersServingInMinistry: 0,
      categories: CategoriasTrajetoriaEntries.map(([name, steps]) => ({
        name,
        description: CategoriaTrajetoriaDescriptions[name],
        completedCount: 0,
        totalPossible: 0,
        percentage: 0,
        membersWithAllSteps: 0,
        steps: steps.map((step) => ({ name: step, completedCount: 0 })),
      })),
    };
  }

  const totalPossibleSteps = totalMembers * TotalPassosTrajetoria;
  let totalCompletedSteps = 0;
  let membersWithFullTrajectory = 0;
  let membersWithDiscipulador = 0;
  let membersServingInMinistry = 0;

  for (const member of members) {
    totalCompletedSteps += member.passosConcluidos.length;
    if (member.passosConcluidos.length === TotalPassosTrajetoria) {
      membersWithFullTrajectory++;
    }
    if (member.discipuladorNome) {
      membersWithDiscipulador++;
    }
    if (member.ministerios.length > 0) {
      membersServingInMinistry++;
    }
  }

  const overallPercentage = Math.round(
    (totalCompletedSteps / totalPossibleSteps) * 100
  );

  const categories = CategoriasTrajetoriaEntries.map(([name, categorySteps]) => {
    const totalPossible = totalMembers * categorySteps.length;
    let completedCount = 0;
    let membersWithAllSteps = 0;

    const stepCounts = new Map<PassoTrajetoria, number>();
    for (const step of categorySteps) {
      stepCounts.set(step, 0);
    }

    for (const member of members) {
      let memberStepsInCategory = 0;
      for (const passo of member.passosConcluidos) {
        if ((categorySteps as readonly string[]).includes(passo)) {
          completedCount++;
          memberStepsInCategory++;
          stepCounts.set(passo as PassoTrajetoria, (stepCounts.get(passo as PassoTrajetoria) ?? 0) + 1);
        }
      }
      if (memberStepsInCategory === categorySteps.length) {
        membersWithAllSteps++;
      }
    }

    const steps = categorySteps.map((step) => ({
      name: step,
      completedCount: stepCounts.get(step) ?? 0,
    }));

    return {
      name,
      description: CategoriaTrajetoriaDescriptions[name],
      completedCount,
      totalPossible,
      percentage: totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0,
      membersWithAllSteps,
      steps,
    };
  });

  return {
    totalMembers,
    totalCompletedSteps,
    totalPossibleSteps,
    overallPercentage,
    membersWithFullTrajectory,
    membersWithDiscipulador,
    membersServingInMinistry,
    categories,
  };
}
