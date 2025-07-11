export interface CreateUserInput {
  firstName: string;
  lastName: string;
  description?: string | null;
  gitUrl?: string | null;
  linkedinUrl?: string | null;
  linkedinId?: string | null;
}