import { LocationFormKeys, LoginFormKeys, PersonalInfoFormKeys } from "./FormKeys";
import { environment } from "@environments/environment";
import { getAuthToken, getStoredProfileInfo } from "@services/auth/authStore";
import { ensureResponseIsSuccessful } from "@services/common";
import { BackendClientConfig, BackendUser } from "@typedefs/backend";
import * as dayjs from "dayjs";

interface ProfileFormData {
  personalInfo: Record<Exclude<PersonalInfoFormKeys, "birthDate">, string> & { birthDate: Date | null },
  location: Record<LocationFormKeys, string>,
  login: Record<Exclude<LoginFormKeys, "password" | "passwordConfirmation">, string>
}

export async function loadProfileFormData(): Promise<ProfileFormData> {
  const currentProfile = getStoredProfileInfo();
  const userResponse = await ensureResponseIsSuccessful<BackendUser>(
    fetch(`${environment.url}/api/v1/users/${currentProfile.id}`, {
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      }
    })
  );

  const userProfile = userResponse.profile;
  let clientConfig = userProfile.client_config;
  if (typeof clientConfig === "string") {
    clientConfig = JSON.parse(clientConfig) as BackendClientConfig;
  }

  let birthdayValue: Date | null = null;
  if (userProfile.birthday) {
    const birthdayObject = dayjs(userProfile.birthday, "YYYY-MM-DD");
    if (birthdayObject.isValid()) {
      birthdayValue = birthdayObject.toDate();
    }
  }

  const lastNameComponents = userProfile.last_names?.split(" ") || [];
  const lastName = lastNameComponents.length > 1 ? lastNameComponents[1] : "";
  const maidenName = lastNameComponents.length > 0 ? lastNameComponents[0] : "";

  return {
    personalInfo: {
      referralSource: clientConfig?.client_type,
      referralHierarchy1: clientConfig?.client,
      referralHierarchy2: clientConfig?.selectA,
      referralHierarchy3: clientConfig?.selectB,
      referralHierarchy4: clientConfig?.selectC,
      referralHierarchy5: clientConfig?.selectD,
      birthDate: birthdayValue,
      educationLevel: userProfile.education_level_id?.toString(),
      gender: userProfile.gender_id?.toString(),
      lastName,
      maidenName,
      maritalStatus: userProfile.civil_status_id?.toString(),
      name: userProfile.first_names
    },
    location: {
      city: userProfile.city_id?.toString(),
      country: userProfile.country_id?.toString(),
      state: userProfile.state_id?.toString()
    },
    login: {
      emailAddress: userResponse.email,
      phoneNumber: userProfile.phone
    }
  };
}