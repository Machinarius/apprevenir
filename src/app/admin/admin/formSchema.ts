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
  | "locations"
  | "areas"
  | "shifts"
  | "schools"
  | "grades"
  | "schoolGrades";

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
    locations: [[]],
    areas: [[]],
    shifts: [[]],
    schools: [[]],
    grades: [[]],
    programs: [[]],
    modalities: [[]],
    semesters: [[]],
    schoolGrades: [[]]
  });
}