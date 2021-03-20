import { ClientTypes, User } from "@typedefs/backend";
import { environment } from "@environments/environment";
import { ensureResponseIsSuccessful, getAuthHeaders } from "@services/common";

export function getClientsOfType(clientType: ClientTypes): Promise<User[]> {
  return ensureResponseIsSuccessful<User[]>(fetch(`${environment.url}/api/v1/clients?client=${clientType}`));
}

export function getUserData(userId: string | number): Promise<User> {
  return ensureResponseIsSuccessful<User>(fetch(`${environment.url}/api/v1/users/${userId}`, {
    headers: getAuthHeaders()
  }));
}

export function getAllUsers(system: boolean = false): Promise<User[]> {
  let urlUsers = !system ? `${environment.url}/api/v1/users` : `${environment.url}/api/v1/users?system=user`;
  return ensureResponseIsSuccessful<User[]>(fetch(`${urlUsers}`, {
    headers: getAuthHeaders()
  }));
}