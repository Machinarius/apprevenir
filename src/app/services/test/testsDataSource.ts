import { Test } from "@typedefs/backend";
import { environment } from "@environments/environment";
import { ensureResponseIsSuccessful, getAuthHeaders } from "@services/common";

export function getAllTests(): Promise<Test[]> {
  return ensureResponseIsSuccessful<Test[]>(fetch(`${environment.url}/api/v1/tests`, {
    headers: getAuthHeaders()
  }));
}
