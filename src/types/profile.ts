export type UserRole = "gestor" | "especialista";

export interface Profile {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  created_at: string;
}
