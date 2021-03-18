import { FormGroup } from "@angular/forms";
import { RegistrationSystemRequest, BackendResponse } from "@typedefs/backend";
import { RawFormData } from "./FormKeys";
import { environment } from "@environments/environment";
import { getAuthToken, getStoredProfileInfo, updateStoredProfile } from "@services/auth/authStore";
import { getUserData } from "@services/user/usersDataSource";

export interface RegistrationResult {
  wasSuccessful: boolean,
  errorMessages: string[]
}

export async function submitRegistrationForms(
  isEditingProfile: boolean,
  adminModeEnabled: boolean,
  ...forms: FormGroup[]
): Promise<RegistrationResult> {
  const rawFormData: RawFormData = forms.reduce((data, form) => Object.assign(data, form.value), {});
 
  const registrationPayload: RegistrationSystemRequest = {
    civil_status_id: rawFormData.maritalStatus as string,
    client: "persona natural",
    email: rawFormData.emailAddress as string,
    first_name_two: rawFormData.lastName as string,
    first_names: rawFormData.name as string,
    status: parseInt(rawFormData.status as string),
    last_names: rawFormData.lastName as string,
    last_names_two: rawFormData.lastNameTwo as string,
    password: rawFormData.password as string,
    password_confirmation: rawFormData.passwordConfirmation as string,
    phone: rawFormData.phoneNumber as string,
  };

  let url = `${environment.url}/api/v1/users/systems/create`;
  let method = "POST";
  let headers: { [key: string]: string } = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getAuthToken()}`
  };

  if (isEditingProfile) {
    const currentProfile = getStoredProfileInfo();
    url = `${environment.url}/api/v1/users/${currentProfile.id}`;
    method = "PUT";
  }

  const response = await fetch(url, {
    body: JSON.stringify(registrationPayload),
    method,
    headers
  });

  const resultObject: RegistrationResult = { wasSuccessful: true, errorMessages: [] };
  const responsePayload = await response.json() as BackendResponse<{}>;
  
  if (!responsePayload.success) {
    resultObject.wasSuccessful = false;
    if (responsePayload.errors) {
      const errors = responsePayload.errors;
      resultObject.errorMessages = Object.keys(errors).reduce((messages, key) => [...messages, ...errors[key]], []);
    }
  } else {
    if (isEditingProfile && !adminModeEnabled) {
      const currentProfile = getStoredProfileInfo();
      const profileResult = await getUserData(currentProfile.id);
      updateStoredProfile(profileResult);
    }
  }

  return resultObject;
}