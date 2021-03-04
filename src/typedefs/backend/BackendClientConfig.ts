import { BackendClientTypes } from "./BackendClientTypes";

export interface BackendClientConfig {
  client_type: BackendClientTypes,
  client: string | null,
  selectA: string | null,
  selectB: string | null,
  selectC: string | null
}