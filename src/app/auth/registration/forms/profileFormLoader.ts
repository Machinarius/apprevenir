import { LocationFormKeys, LoginFormKeys, PersonalInfoFormKeys } from "./FormKeys";
import { getStoredProfileInfo } from "@services/auth/authStore";
import { getUserData } from "@services/user/usersDataSource";
import { UserClientConfig } from "@typedefs/backend";
import * as dayjs from "dayjs";

export interface ProfileFormData {
  personalInfo: Record<Exclude<PersonalInfoFormKeys, "birthDate">, string> & { birthDate: Date | null },
  location: Record<LocationFormKeys, string | number>,
  login: Record<Exclude<LoginFormKeys, "password" | "passwordConfirmation" | "currentPassword">, string>
}

export async function loadProfileFormData(userIdOveride: string | null = null): Promise<ProfileFormData> {
  let userId: string | number;
  if (userIdOveride) {
    userId = userIdOveride;
  } else {
    const currentProfile = getStoredProfileInfo();
    userId = currentProfile.id;
  }

  const userResponse = await getUserData(userId);
  const userProfile = userResponse.profile;
  let clientConfig = userProfile.client_config;
  if (typeof clientConfig === "string") {
    clientConfig = JSON.parse(clientConfig) as UserClientConfig;
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
      city: userProfile.city_id,
      country: userProfile.country_id,
      state: userProfile.state_id
    },
    login: {
      emailAddress: userResponse.email,
      phoneNumber: userProfile.phone
    }
  };
}