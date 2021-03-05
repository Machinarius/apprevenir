import { BackendClientTypes, BackendResponse, BackendUser } from "@typedefs/backend";
import { environment } from "@environments/environment";

export async function getClients(clientType: BackendClientTypes): Promise<BackendUser[]> {
  const result = await fetch(`${environment.url}/api/v1/clients?client=${clientType}`);
  if (!result.ok) {
    throw new Error("The server could not reply to the request");
  }

  const response = await result.json() as BackendResponse<BackendUser[]>;
  if (!response.success) {
    throw new Error("The server could not reply to the request");
  }

  return response.data;
}