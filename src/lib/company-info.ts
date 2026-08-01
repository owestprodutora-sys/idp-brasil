// Dados institucionais centralizados do IDP Brasil.
// Campos com valor `null` ainda não têm dado real confirmado — os
// componentes que consomem este arquivo devem OCULTAR esses campos em vez
// de exibir texto de placeholder para o usuário final. Preencha aqui assim
// que o dado oficial (CNPJ, endereço, telefone) estiver disponível; nenhum
// componente precisa ser alterado quando isso acontecer.
export const companyInfo = {
  nomeFantasia: "IDP Brasil",
  tagline: "Especialistas em análise de isenção do Imposto de Renda.",
  nomeEmpresa: null as string | null,
  cnpj: null as string | null,
  telefone: null as string | null,
  whatsapp: null as string | null,
  email: "contato@idpbrasil.com.br",
  endereco: null as string | null,
  cidade: null as string | null,
  estado: null as string | null,
  site: "idpbrasil.com.br",
  prazoRetornoUteis: "1 dia útil",
} as const;

