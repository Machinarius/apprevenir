import { BackendResponse } from "@typedefs/backend";
import { getAuthToken } from "./auth/authStore";

export function getAuthHeaders() {
  return {
    "Authorization": `Bearer ${getAuthToken()}`
  };
}

type ErrorsDictionary = { [key: string]: string[] };

export class BackendError extends Error {
  get errorMessages(): string[] {
    return Object.keys(this.rawErrors).map(key => this.rawErrors[key].join(", "));
  }

  constructor(public rawErrors: ErrorsDictionary) {
    super("The server replied negatively to the request");
  }
}

export async function ensureResponseIsSuccessful<TPayload>(requestPromise: ReturnType<typeof fetch>): Promise<TPayload> {
  const result = await requestPromise;
  const response = await result.json() as BackendResponse<TPayload>;
  if (!response.success) {
    throw new BackendError(response.errors);
  }

  return response.data;
}