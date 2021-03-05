import { BackendClientConfig } from "./BackendClientConfig";
import { BackendClientTypes } from "./BackendClientTypes";

export interface BackendRegistrationRequest {
  birthday: string,
  city_id: string,
  civil_status_id: string,
  client: "persona natual", // Typo from back-end :shrugs:
  client_config: BackendClientConfig,
  client_type: BackendClientTypes,
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
  selectA: string,
  selectB: string,
  selectC: string,
  state_id: string
}