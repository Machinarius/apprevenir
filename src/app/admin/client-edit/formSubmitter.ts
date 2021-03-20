import { environment } from "@environments/environment";
import { ensureResponseIsSuccessful, getAuthHeaders } from "@services/common";
import { ClientRegistrationRequest, ClientTypes } from "@typedefs/backend";
import { ClientFormRawValues } from "./formSchema";
import { UserInputTerm } from "./models/UserInputTerm";
import { UserZone } from "./models/UserZone";

export async function submitClientCreationForm(rawValues: ClientFormRawValues, editModeEnabled: boolean, currentUserId: number | null): Promise<void> {
  const userId = await createOrUpdateUser(rawValues, editModeEnabled, currentUserId);
  const clientType = rawValues.clientType as ClientTypes;
  switch (clientType) {
    case ClientTypes.Company:
      await uploadCompanyData(rawValues, userId);
      break;
    case ClientTypes.EducationBureau:
      await uploadEducationBureauData(rawValues, userId);
      break;
    case ClientTypes.EducationalInstitution:
      await uploadEducationalInstitutionData(rawValues, userId);
      break;
    case ClientTypes.TerritorialEntity:
      await uploadTerritorialEntityData(rawValues, userId);
      break;
    case ClientTypes.University:
      await uploadUniversityData(rawValues, userId);
      break;
    default:
      throw new Error(`Uploading a registration form for client type '${clientType}' is not implemented`);
  }

  // TODO: Write this when the API has been implemented
  //await uploadEnabledTests(rawValues, userId);
}

async function createOrUpdateUser(rawValues: ClientFormRawValues, editModeEnabled: boolean, currentUserId: number | null): Promise<number> {
  if (editModeEnabled && currentUserId === null) {
    throw new Error("You must supply the current user id if you are editing a user");
  } 

  const userRequestData: ClientRegistrationRequest = {
    client: rawValues.clientType as ClientTypes,
    first_names: rawValues.names as string,
    phone: rawValues.phone as string,
    email: rawValues.email as string,
    country_id: rawValues.country as number,
    state_id: rawValues.state as number,
    city_id: rawValues.city as number,
    client_config: {
      national_id: rawValues.nationalId as string,
      // @ts-expect-error
      brand_color: rawValues.brandColor.hex as string
    }
  };

  let method = "POST";
  let url = `${environment.url}/api/v1/clients/new`;
  if (editModeEnabled) {
    method = "PUT";
    url = `${environment.url}/api/v1/client/${currentUserId}`;
  }

  const userObject = await ensureResponseIsSuccessful<{ id: number }>(fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    method: method,
    body: JSON.stringify(userRequestData)
  }));

  return userObject.id;
}

async function uploadTerritorialEntityData(rawValues: ClientFormRawValues, userId: number) {
  const urbanZones = rawValues.urbanZones as UserZone[];
  const ruralZones = rawValues.ruralZones as UserZone[];
  const allZones = [...urbanZones, ...ruralZones];

  function zoneWasCreated(zone: UserZone) { return !zone.cameFromServer && !zone.deletedByUser; };
  function zoneWasDeleted(zone: UserZone) { return zone.cameFromServer && zone.deletedByUser; };

  const zonesNeedingChanges = allZones.filter(zone => 
    zoneWasCreated(zone) || zoneWasDeleted(zone) || zone.editedByUser
  );

  const promises = zonesNeedingChanges.map(zone => {
    if (zoneWasDeleted(zone)) {
      return deleteZone(zone);
    }

    if (zoneWasCreated(zone)) {
      return createZone(zone, userId);
    }

    if (zone.editedByUser) {
      return updateZone(zone, userId);
    }

    throw new Error("Invalid operation - zone needs no changes");
  });

  await Promise.all(promises);
} 

function deleteZone(zone: UserZone): Promise<void> {
  return ensureResponseIsSuccessful<void>(fetch(`${environment.url}/api/v1/communes/${zone.id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders()
    }
  }));
}

async function createZone(zone: UserZone, userId: number): Promise<void> {
  const zoneResponse = await ensureResponseIsSuccessful<{ id: number }>(fetch(`${environment.url}/api/v1/communes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({
      user_id: userId,
      commune: zone.name,
      zone_type: zone.type
    })
  }));

  const zoneId = zoneResponse.id;
  const deltaRequests = computeTermDeltaRequests(zone.children, zoneId, "neighborhoods", "neighborhood", "commune_id");
  await runRESTRequests(deltaRequests);
}

async function updateZone(zone: UserZone, userId: number): Promise<void> {
  await ensureResponseIsSuccessful(fetch(`${environment.url}/api/v1/communes/${zone.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({
      user_id: userId,
      commune: zone.name
    })
  }));

  const deltaRequests = computeTermDeltaRequests(zone.children, zone.id, "neighborhoods", "neighborhood", "commune_id"); 
  await runRESTRequests(deltaRequests);
}

async function uploadUniversityData(rawValues: ClientFormRawValues, userId: number) {
  const programs = rawValues.programs as UserInputTerm[];
  const modalities = rawValues.modalities as UserInputTerm[];
  const semesters = rawValues.semesters as UserInputTerm[];

  await runRESTRequests([
    ...computeTermDeltaRequests(programs, userId, "programs", "program"),
    ...computeTermDeltaRequests(modalities, userId, "modalities", "modality"),
    ...computeTermDeltaRequests(semesters, userId, "semesters", "semester")
  ]);
}

async function uploadEducationalInstitutionData(rawValues: ClientFormRawValues, userId: number) {
  const grades = rawValues.schoolGrades  as UserInputTerm[];

  await runRESTRequests([
    ...computeTermDeltaRequests(grades, userId, "educational/grades", "grade"),
  ]);
}

async function uploadEducationBureauData(rawValues: ClientFormRawValues, userId: number) {
  const schools = rawValues.schools as UserInputTerm[];
  const grades = rawValues.grades  as UserInputTerm[];

  await runRESTRequests([
    ...computeTermDeltaRequests(schools, userId, "educational/institutions", "educational_institution"),
    ...computeTermDeltaRequests(grades, userId, "grades", "grade"),
  ]);
}

async function uploadCompanyData(rawValues: ClientFormRawValues, userId: number) {
  const areas = rawValues.areas as UserInputTerm[];
  const shifts = rawValues.shifts as UserInputTerm[];
  const locations = rawValues.locations as UserInputTerm[];

  await runRESTRequests([
    ...computeTermDeltaRequests(locations, userId, "locations", "location"),
    ...computeTermDeltaRequests(areas, userId, "areas", "area"),
    ...computeTermDeltaRequests(shifts, userId, "schedules", "schedul")
  ]);
}

type RESTRequest = {
  method: "POST" | "DELETE",
  url: string,
  jsonBody: unknown | null
}

function computeTermDeltaRequests(
  terms: UserInputTerm[], userId: number, 
  urlFragment: string, labelAttribute: string,
  userIdAttribute = "user_id"
): RESTRequest[] {
  function termWasCreated(term: UserInputTerm) { return !term.cameFromServer && !term.deletedByUser; };
  function termWasDeleted(term: UserInputTerm) { return term.cameFromServer && term.deletedByUser; };

  const termsNeedingChanges = terms.filter(term => termWasCreated(term) || termWasDeleted(term));
  const requests: RESTRequest[] = termsNeedingChanges.map(term => {
    if (termWasCreated(term)) {
      return {
        method: "POST",
        url: `${environment.url}/api/v1/${urlFragment}`,
        jsonBody: {
          [userIdAttribute]: userId,
          [labelAttribute]: term.label
        }
      };
    }

    if (termWasCreated(term)) {
      return {
        method: "DELETE",
        url: `${environment.url}/api/v1/${urlFragment}/${term.id}`,
        jsonBody: null
      };
    }

    throw new Error("Invalid operation - term needs no changes");
  });

  return requests;
}

async function runRESTRequests(requests: RESTRequest[]): Promise<void> {
  if (!requests.length) {
    return;
  }

  const promises = requests.map(request => {
    return ensureResponseIsSuccessful<void>(fetch(request.url, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: request.jsonBody ? JSON.stringify(request.jsonBody) : undefined
    }));
  });

  await Promise.all(promises);
}