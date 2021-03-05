import { BackendResponse, BackendUser } from "@typedefs/backend";
import { environment } from "@environments/environment";

export default async function loadUniversities(): Promise<{ id: number, label: string }[]> {
  const serverResponse = await fetch(environment.url + "/api/v1/clients?client=universidades");
  if (!serverResponse.ok) {
    throw new Error("The server could not fulfill the request");
  }

  const responseBody: BackendResponse<BackendUser[]> = await serverResponse.json();
  if (!responseBody.success) {
    throw new Error("The server could not fulfill the request");
  }

  const universitiesData = responseBody.data.map(user => ({
    id: user.id,
    label: `${user.profile.first_names} ${user.profile.last_names}`
  }));

  return universitiesData;
}