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
  /**
   * The program the user is enrolled in, if in an university
   */
  selectA: string | null,
  /**
   * The semester of the program the user is in 
   */
  selectB: string | null,
  /**
   * The modality of the program the user is in
   */
  selectC: string | null
}