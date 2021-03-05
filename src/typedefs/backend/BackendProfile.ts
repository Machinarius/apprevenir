import { BackendClientConfig } from "./BackendClientConfig";

export interface BackendProfile {
  id: number,
  user_id: number,
  first_names: string,
  last_names: string,
  phone: string | null,
  birhday: string | null,
  education_level_id: number,
  is_student: number, // It really is a boolean, BRUH...
  gender_id: number | null,
  civil_status_id: number | null,
  country_id: number | null,
  state_id: number | null,
  city_id: number | null,
  client_config: string | BackendClientConfig | null,
  created_at: string | null,
  updated_at: string | null,
  deleted_at: string | null
}