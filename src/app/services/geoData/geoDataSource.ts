import { BackendCity, BackendCountry, BackendState } from "@typedefs/backend";
import { environment } from "@environments/environment";
import { ensureResponseIsSuccessful } from "@services/common";

export function getCountries(): Promise<BackendCountry[]> {
  return ensureResponseIsSuccessful<BackendCountry[]>(fetch(`${environment.url}/api/v1/countries`));
}

export function getStates(countryId: string | number): Promise<BackendState[]> {
  return ensureResponseIsSuccessful<BackendState[]>(fetch(`${environment.url}/api/v1/states?country=${countryId}`));
}

export function getCities(stateId: string | number): Promise<BackendCity[]> {
  return ensureResponseIsSuccessful<BackendCity[]>(fetch(`${environment.url}/api/v1/cities?state=${stateId}`));
}