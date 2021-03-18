export interface RegistrationSystemRequest {
  civil_status_id: string,
  client: "persona natural",
  email: string,
  first_name_two: string,
  first_names: string,
  status: number,
  last_names: string,
  last_names_two: string,
  password: string,
  password_confirmation: string,
  phone: string,
}