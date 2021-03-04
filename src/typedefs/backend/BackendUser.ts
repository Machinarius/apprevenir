import { BackendClientTypes } from "./BackendClientTypes";
import { BackendProfile } from "./BackendProfile";

export interface BackendUser {
  id: number,
  reference: number,
  email: string,
  email_verified_at: string,
  client: BackendClientTypes,
  status: number, // It really is a boolean tho... BRUH
  created_at: string,
  updated_at: string,
  deleted_at: string | null,
  profile: BackendProfile
}