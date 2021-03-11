import { City, Country, State } from "@typedefs/backend";
import { environment } from "@environments/environment";
import { ensureResponseIsSuccessful } from "@services/common";

export function getCountries(): Promise<Country[]> {
  return ensureResponseIsSuccessful<Country[]>(fetch(`${environment.url}/api/v1/countries`));
}

export function getStates(countryId: string | number): Promise<State[]> {
  return ensureResponseIsSuccessful<State[]>(fetch(`${environment.url}/api/v1/states?country=${countryId}`));
}

export function getCities(stateId: string | number): Promise<City[]> {
  return ensureResponseIsSuccessful<City[]>(fetch(`${environment.url}/api/v1/cities?state=${stateId}`));
}