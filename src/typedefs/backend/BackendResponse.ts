export interface BackendResponse<TContent> {
  success: boolean,
  data: TContent
}