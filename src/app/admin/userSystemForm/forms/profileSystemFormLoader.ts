import { PersonalInfoFormKeys } from "./FormKeys";
import { getStoredProfileInfo } from "@services/auth/authStore";
import { getUserData } from "@services/user/usersDataSource";

export interface ProfileSystemFormData {
  id: any,
  personalInfo: Record<Exclude<PersonalInfoFormKeys, "" | "password" | "passwordConfirmation" | "currentPassword">, string>,
}

export async function loadProfileFormData(userIdOveride: string | null = null): Promise<ProfileSystemFormData> {
  let userId: string | number;
  if (userIdOveride) {
    userId = userIdOveride;
  } else {
    const currentProfile = getStoredProfileInfo();
    userId = currentProfile.id;
  }

  const userResponse = await getUserData(userId);
  const userProfile = userResponse.profile;
 

  return {
    id: userId,
    personalInfo: {
      name: userProfile.first_names,
      lastName: userProfile.last_names,
      lastNameTwo: userProfile.last_names_two,
      status: userResponse.status?.toString(),
      maritalStatus: userProfile.civil_status_id?.toString(),
      phoneNumber: userProfile.phone,
      emailAddress: userResponse.email,
    },
  };
}