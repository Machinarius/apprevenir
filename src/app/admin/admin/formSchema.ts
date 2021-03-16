import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export type ClientFormKeys =
  | "clientType"
  | "names"
  | "phone"
  | "nationalId"
  | "email"
  | "password"
  | "passwordConfirmation"
  | "brandColor"
  | "country"
  | "state"
  | "city"
  | "communes"
  | "neighborhoods"
  | "locations"
  | "areas"
  | "shifts"
  | "schools";

export function buildClientFormGroup(formBuilder: FormBuilder): FormGroup {
  return formBuilder.group({
    clientType: ['', Validators.required],
    names: ['', Validators.required],
    phone: ['', Validators.required],
    nationalId: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    passwordConfirmation: ['', Validators.required],
    brandColor: ['', Validators.required],
    country: [ { value: '', disabled: true }, Validators.required],
    state: [ { value: '', disabled: true }, Validators.required],
    city: [ { value: '', disabled: true }, Validators.required],
    communes: [[]],
    neighborhoods: [[]],
    locations: [[]],
    areas: [[]],
    shifts: [[]],
    schools: [[]]
  });
}