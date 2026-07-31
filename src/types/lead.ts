export interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  cidade: string;
  estado: string;
  aposentado: string | null;
  tributavel: string | null;
  doenca: string | null;
  qual_doenca: string | null;
  laudo: string | null;
  lgpd_aceito: boolean;
  status: string;
  created_at: string;
}
