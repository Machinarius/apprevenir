import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Test } from "@typedefs/backend";

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
    schoolGrades: [[]],
    enabledTests: [[]]
  });
}

export function configureTestsControl(formGroup: FormGroup, tests: Test[]) {
  tests.forEach(test => {
    const control = new FormControl(false);
    control.valueChanges.subscribe(generateTestEnabledChangeHandler(test));
    formGroup.addControl(`tests[${test.id}]`, control);
  });
}

function generateTestEnabledChangeHandler(test: Test) {
  return (value: boolean) => {
    // TODO
  };
}