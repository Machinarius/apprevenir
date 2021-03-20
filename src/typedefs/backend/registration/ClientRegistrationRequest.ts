import { ClientTypes } from "../userData/ClientTypes";

export interface ClientRegistrationRequest {
  client: ClientTypes,
  first_names: string,
  last_names: "\u00A0",
  last_names_two: "\u00A0",
  phone: string,
  email: string,
  password: string,
  password_confirmation: string,
  country_id: number,
  state_id: number,
  city_id: number,
  client_config: {
    national_id: string,
    brand_color: string
  }
}