import { FormGroup } from "@angular/forms";
import { BackendClientTypes, BackendRegistrationRequest, BackendResponse } from "@typedefs/backend";
import { RawFormData } from "./FormKeys";
import { environment } from "@environments/environment";
import * as dayjs from "dayjs";
import { getAuthToken, getStoredProfileInfo } from "@services/auth/authStore";

export interface RegistrationResult {
  wasSuccessful: boolean,
  errorMessages: string[]
}

export async function submitRegistrationForms(
  isEditingProfile: boolean,
  ...forms: FormGroup[]
): Promise<RegistrationResult> {
  const rawFormData: RawFormData = forms.reduce((data, form) => Object.assign(data, form.value), {});
  const birthdayValue = dayjs(rawFormData.birthDate).format("YYYY-MM-DD");

  const registrationPayload: BackendRegistrationRequest = {
    birthday: birthdayValue,
    country_id: rawFormData.country as string,
    state_id: rawFormData.state as string,
    city_id: rawFormData.city as string,
    civil_status_id: rawFormData.maritalStatus as string,
    client: "persona natual",
    client_type: rawFormData.referralSource as BackendClientTypes,
    education_level_id: rawFormData.educationLevel as string,
    email: rawFormData.emailAddress as string,
    first_name_two: rawFormData.lastName as string,
    first_names: rawFormData.name as string,
    gender_id: parseInt(rawFormData.gender as string),
    last_name_one: rawFormData.maidenName as string,
    last_names: rawFormData.maidenName + " " + rawFormData.lastName,
    password: rawFormData.password as string,
    password_confirmation: rawFormData.passwordConfirmation as string,
    phone: rawFormData.phoneNumber as string,
    reference: rawFormData.referralHierarchy1 as string,
    client_config: {
      client_type: rawFormData.referralSource as BackendClientTypes,
      client: rawFormData.referralHierarchy1 as string,
      selectA: rawFormData.referralHierarchy2 as string,
      selectB: rawFormData.referralHierarchy3 as string,
      selectC: rawFormData.referralHierarchy4 as string,
      selectD: rawFormData.referralHierarchy5 as string
    }
  };

  let url = `${environment.url}/api/v1/register`;
  let method = "POST";
  let headers: { [key: string]: string } = {
    "Content-Type": "application/json"
  };

  if (isEditingProfile) {
    const currentProfile = getStoredProfileInfo();
    url = `${environment.url}/api/v1/users/${currentProfile.id}`;
    method = "PUT";
    headers = {
      ...headers,
      "Authorization": `Bearer ${getAuthToken()}`
    };
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
  }

  return resultObject;
}