import { BackendClientTypes } from "./BackendClientTypes";

export interface BackendClientConfig {
  /**
   * The type of user who referred this user
   */
  client_type: BackendClientTypes,
  /**
   * The id of the user that referred this user
   */
  client: string | null,
  selectA: string | null,
  selectB: string | null,
  selectC: string | null,
  selectD: string | null
}