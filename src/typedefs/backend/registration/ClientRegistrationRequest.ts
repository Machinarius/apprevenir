import { ClientTypes } from "../userData/ClientTypes";

export interface ClientRegistrationRequest {
  client: ClientTypes,
  first_names: string,
  phone: string,
  email: string,
  country_id: number,
  state_id: number,
  city_id: number,
  client_config: {
    national_id: string,
    brand_color: string
  }
}