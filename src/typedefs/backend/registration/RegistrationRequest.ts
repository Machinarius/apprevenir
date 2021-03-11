import { UserClientConfig } from "../userData/UserClientConfig";
import { ClientTypes } from "../userData/ClientTypes";

export interface RegistrationRequest {
  birthday: string,
  city_id: string,
  civil_status_id: string,
  client: "persona natual", // Typo from back-end :shrugs:
  client_config: UserClientConfig,
  client_type: ClientTypes,
  country_id: string,
  education_level_id: string,
  email: string,
  first_name_two: string,
  first_names: string,
  gender_id: number,
  last_name_one: string,
  last_names: string,
  password: string,
  password_confirmation: string,
  phone: string,
  reference: string,
  state_id: string
}