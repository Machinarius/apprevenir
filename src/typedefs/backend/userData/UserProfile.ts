import { UserClientConfig } from "./UserClientConfig";

export interface UserProfile {
  id: number,
  user_id: number,
  first_names: string,
  last_names: string,
  phone: string | null,
  birthday: string | null,
  education_level_id: number,
  is_student: number, // It really is a boolean, BRUH...
  gender_id: number | null,
  civil_status_id: number | null,
  country_id: number | null,
  state_id: number | null,
  city_id: number | null,
  client_config: string | UserClientConfig | null,
  created_at: string | null,
  updated_at: string | null,
  deleted_at: string | null
}