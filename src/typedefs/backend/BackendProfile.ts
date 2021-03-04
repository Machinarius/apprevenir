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
  client_config: unknown | null,
  created_at: string,
  updated_at: string,
  deleted_at: string | null
}