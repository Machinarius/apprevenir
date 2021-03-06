import { EventBus } from "@services/messaging/EventBus";
import { EventMessageWithPayload, KnownMessageKeys } from "@services/messaging/EventMessage";

enum Roles {
  Root = "root",
  Admin = "admin",
  Client = "client"
}

export interface IProfileInfo {
  id: number,
  userId: number,
  email: string,
  firstNames: string,
  lastNames: string,
  phoneNumber: string,
  birthday: string,
  educationLevelId: number,
  isStudent: boolean,
  genderId: number,
  civilStatusId: number,
  countryId: number,
  stateId: number,
  cityId: number,
  clientConfig: any | null,
  role: Roles,
  createdAt: Date,
  updatedAt: Date | null
}

export function storedAuthTokenIsValid(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    // TODO: Implement proper public-key validation of the JWT
    const jwtChunks = token.split(".");
    if (jwtChunks.length != 3) {
      return false; // This is not a true JWT
    }

    var payload: { exp?: number } = null;
    try {
      payload = JSON.parse(atob(jwtChunks[1]));
    } catch (error) {
      return false; // Whatever was in local storage is not a proper JWT
    }

    if (!payload.exp) {
      return false; // There's no Expiration field in the JWT payload
    }
    
    const now = new Date();
    const expirationDate = new Date(payload.exp * 1000);
    return now < expirationDate;
}

export function getAuthToken(): string {
  const authToken = localStorage.getItem('token');
  if (!authToken) {
    throw new Error("The auth token could not be retrieved, is the user logged-in?");
  }

  return authToken;
}

export function storeAuhToken(authToken: string) {
  if (!authToken) {
    throw new Error("Can not store a null auth token");
  }

  localStorage.setItem('token', authToken);
}

export function storeProfileInfo(profileInfo: any) {
  if (!profileInfo) {
    throw new Error("Can not store null profile data");
  }

  const normalizedProfile: IProfileInfo = {
    id: profileInfo.user_id,
    userId: profileInfo.userId,
    email: profileInfo.email,
    firstNames: profileInfo.first_names,
    lastNames: profileInfo.last_names,
    phoneNumber: profileInfo.phone,
    birthday: profileInfo.birthday,
    educationLevelId: profileInfo.education_level_id,
    isStudent: profileInfo.is_student == 1, // Bruh...
    genderId: profileInfo.gender_id,
    civilStatusId: profileInfo.civil_status_id,
    countryId: profileInfo.country_id,
    stateId: profileInfo.state_id,
    cityId: profileInfo.city_id,
    clientConfig: profileInfo.client_config,
    role: profileInfo.role as Roles,
    createdAt: new Date(profileInfo.created_at),
    updatedAt: profileInfo.updated_at == null ? null : new Date(profileInfo.updated_at)
  };

  localStorage.setItem('profile', JSON.stringify(normalizedProfile));

  const message = new ProfileChangedMessage(normalizedProfile);
  EventBus.instance.publishMessage(message);
}

export function isUserAdmin() {
  const profile = getStoredProfileInfo();
  return profile.role == Roles.Admin || profile.role == Roles.Root;
}

export function getStoredProfileInfo(): IProfileInfo {
  const storedProfileJSON = localStorage.getItem("profile");
  if (!storedProfileJSON) {
    throw new Error("There's no stored profile data. Is the user logged-in?");
  }

  // Dates are parsed as ISO8601 strings, we have to manually convert them back to Date objects
  const profileObject = JSON.parse(storedProfileJSON);
  profileObject.createdAt = new Date(profileObject.createdAt);
  if (profileObject.updatedAt) {
    profileObject.updatedAt = new Date(profileObject.updatedAt);
  }

  return profileObject as IProfileInfo;
}

export function clearAuthStore() {
  localStorage.removeItem('token');
  localStorage.removeItem('profile');
}

export class ProfileChangedMessage extends EventMessageWithPayload<IProfileInfo> {
  public constructor(
    private readonly profileInfo: IProfileInfo
  ) { 
    super();
  }
  
  get key() { return KnownMessageKeys.ProfileChanged; }
  get payload() { return this.profileInfo; }
}