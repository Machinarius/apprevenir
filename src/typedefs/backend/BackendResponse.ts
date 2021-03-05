export interface BackendResponse<TContent> {
  success: boolean,
  errors?: { [key: string]: string[] },
  data: TContent
}