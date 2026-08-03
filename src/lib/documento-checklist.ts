import { checklistDoServico, DOCUMENTO_STATUS_AVANCADOS } from "@/lib/documento-config";
import { supabase } from "@/lib/supabase";
import type { Documento } from "@/types/documento";

export interface SincronizarChecklistResult {
  documentos: Documento[];
  // true quando o serviço mudou e já existia documento avançado (fora de
  // PENDENTE) que não pertence ao novo checklist — o checklist anterior
  // foi preservado em vez de substituído, e a tela deve avisar a
  // especialista que a troca pode impactar a documentação.
  avisoTrocaComDocumentosAvancados: boolean;
}

// FEATURE 004 — cria/atualiza o checklist documental PERSISTIDO quando o
// serviço do lead é definido ou trocado. O checklist nunca é recalculado
// só em tela: uma vez gerado, cada documento passa a ter ciclo de vida
// próprio em `documentos` (ver sql/010_documentos.sql).
//
// Regras combinadas com o usuário antes de implementar:
//   1. Não duplica — se o serviço for salvo de novo sem mudança, a função
//      nem chega a rodar a lógica de geração (early return abaixo); e
//      mesmo que rodasse, `documentos.tipo` é único por lead no banco.
//   2. Troca "limpa" (nenhum documento do lead avançou de PENDENTE): os
//      itens PENDENTE do checklist antigo que não fazem parte do novo
//      checklist são removidos, e os itens que faltam no novo checklist
//      são criados — comportamento de substituição.
//   3. Troca com documentos já avançados (RECEBIDO, VALIDADO,
//      SOLICITAR_NOVO ou INVALIDO) que não pertencem ao novo checklist:
//      nada é apagado. Só os itens do novo checklist que ainda não
//      existem são adicionados; o restante do checklist anterior
//      permanece como está, preservando o histórico. `avisoTrocaComDocumentosAvancados`
//      volta `true` pra a tela avisar a especialista — a regra pode
//      evoluir depois, mas por ora só evita perda de dado.
export async function sincronizarChecklistDocumentos(
  leadId: string,
  novoServico: string | null,
  servicoAnterior: string | null,
): Promise<SincronizarChecklistResult> {
  // Serviço salvo sem mudança — não mexe em nada (regra 1).
  if (novoServico === servicoAnterior) {
    const { data, error } = await supabase
      .from("documentos")
      .select("*")
      .eq("lead_id", leadId)
      .order("criado_em", { ascending: true });

    if (error) {
      throw new Error(`Não foi possível carregar o checklist: ${error.message}`);
    }

    return { documentos: (data ?? []) as Documento[], avisoTrocaComDocumentosAvancados: false };
  }

  const checklist = checklistDoServico(novoServico);
  const tiposChecklist = new Set(checklist.map((item) => item.tipo));

  const { data: existentesData, error: fetchError } = await supabase
    .from("documentos")
    .select("*")
    .eq("lead_id", leadId);

  if (fetchError) {
    throw new Error(`Não foi possível ler o checklist atual: ${fetchError.message}`);
  }

  const documentosExistentes = (existentesData ?? []) as Documento[];
  const tiposExistentes = new Set(documentosExistentes.map((d) => d.tipo));

  // Documentos avançados (fora de PENDENTE) que ficariam "órfãos" do
  // checklist antigo — é isso que determina se a troca pode ser limpa.
  const avancadosForaDoNovoChecklist = documentosExistentes.filter(
    (d) => DOCUMENTO_STATUS_AVANCADOS.includes(d.status) && !tiposChecklist.has(d.tipo),
  );
  const trocaLimpa = avancadosForaDoNovoChecklist.length === 0;

  // Itens do novo checklist que ainda não existem pra esse lead — sempre
  // seguro inserir (regras 2 e 3 concordam aqui: só adiciona).
  const faltantes = checklist.filter((item) => !tiposExistentes.has(item.tipo));

  if (faltantes.length > 0) {
    const { error: insertError } = await supabase.from("documentos").insert(
      faltantes.map((item) => ({
        lead_id: leadId,
        tipo: item.tipo,
        nome: item.nome,
        status: "PENDENTE",
      })),
    );

    if (insertError) {
      throw new Error(`Não foi possível gerar o checklist: ${insertError.message}`);
    }
  }

  // Regra 2 — troca limpa: remove só as pendências (nunca tocadas) do
  // checklist antigo que não fazem parte do novo serviço.
  if (trocaLimpa) {
    const obsoletos = documentosExistentes.filter(
      (d) => d.status === "PENDENTE" && !tiposChecklist.has(d.tipo),
    );

    if (obsoletos.length > 0) {
      const { error: deleteError } = await supabase
        .from("documentos")
        .delete()
        .in(
          "id",
          obsoletos.map((d) => d.id),
        );

      if (deleteError) {
        throw new Error(`Não foi possível limpar o checklist anterior: ${deleteError.message}`);
      }
    }
  }

  const { data: atualizadosData, error: refetchError } = await supabase
    .from("documentos")
    .select("*")
    .eq("lead_id", leadId)
    .order("criado_em", { ascending: true });

  if (refetchError) {
    throw new Error(`Não foi possível recarregar o checklist: ${refetchError.message}`);
  }

  return {
    documentos: (atualizadosData ?? []) as Documento[],
    avisoTrocaComDocumentosAvancados: !trocaLimpa,
  };
}
