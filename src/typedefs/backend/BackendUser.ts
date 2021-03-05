import { BackendClientTypes } from "./BackendClientTypes";
import { BackendProfile } from "./BackendProfile";

export interface BackendUser<TClientType extends BackendClientTypes = BackendClientTypes.NaturalPerson> {
  id: number,
  reference: number | null,
  email: string,
  email_verified_at: string,
  client: TClientType,
  status: number,
  created_at: string,
  updated_at: string,
  deleted_at: string | null,
  profile: BackendProfile
}