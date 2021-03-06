import { FormGroup } from "@angular/forms";
import { BackendClientTypes, BackendRegistrationRequest, BackendResponse } from "@typedefs/backend";
import { RawFormData } from "./FormKeys";
import { environment } from "@environments/environment";
import * as dayjs from "dayjs";

export interface RegistrationResult {
  wasSuccessful: boolean,
  errorMessages: string[]
}

export async function submitRegistrationForms(
  ...forms: FormGroup[]
): Promise<RegistrationResult> {
  const rawFormData: RawFormData = forms.reduce((data, form) => Object.assign(data, form.value), {});
  const birthdayValue = dayjs(rawFormData.birthDate).format("YYYY-MM-DD");

  const registrationPayload: BackendRegistrationRequest = {
    birthday: birthdayValue,
    country_id: rawFormData.country,
    state_id: rawFormData.state,
    city_id: rawFormData.city,
    civil_status_id: rawFormData.maritalStatus,
    client: "persona natual",
    client_type: rawFormData.referralSource as BackendClientTypes,
    education_level_id: rawFormData.educationLevel,
    email: rawFormData.emailAddress,
    first_name_two: rawFormData.lastName,
    first_names: rawFormData.name,
    gender_id: parseInt(rawFormData.gender),
    last_name_one: rawFormData.maidenName,
    last_names: rawFormData.maidenName + " " + rawFormData.lastName,
    password: rawFormData.password,
    password_confirmation: rawFormData.passwordConfirmation,
    phone: rawFormData.phoneNumber,
    reference: rawFormData.referralHierarchy1,
    client_config: {
      client_type: rawFormData.referralSource as BackendClientTypes,
      client: rawFormData.referralHierarchy1,
      selectA: rawFormData.referralHierarchy2,
      selectB: rawFormData.referralHierarchy3,
      selectC: rawFormData.referralHierarchy4,
      selectD: rawFormData.referralHierarchy5
    }
  };

  const response = await fetch(`${environment.url}/api/v1/register`, {
    body: JSON.stringify(registrationPayload),
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
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