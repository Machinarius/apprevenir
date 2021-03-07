import { BackendResponse } from "@typedefs/backend";
import { getAuthToken } from "./auth/authStore";

export function getAuthHeaders() {
  return {
    "Authorization": `Bearer ${getAuthToken()}`
  };
}

export async function ensureResponseIsSuccessful<TPayload>(requestPromise: ReturnType<typeof fetch>): Promise<TPayload> {
  const result = await requestPromise;
  if (!result.ok) {
    throw new Error("The server could not reply to the request");
  }

  const response = await result.json() as BackendResponse<TPayload>;
  if (!response.success) {
    throw new Error("The server could not reply to the request");
  }

  return response.data;
}