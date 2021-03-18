import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
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
    selectedTests: [{}, validateSelectedTests]
  });
}

export function configureTestsControl(formGroup: FormGroup, tests: Test[]) {
  tests.forEach(test => {
    const control = new FormControl(false);
    control.valueChanges.subscribe(generateTestEnabledChangeHandler(test, formGroup));
    formGroup.addControl(`tests[${test.id}]`, control);
  });
}

function generateTestEnabledChangeHandler(test: Test, formGroup: FormGroup) {
  return (value: boolean) => {
    const testsControl = formGroup.get("selectedTests");
    testsControl.value[test.id] = value;
    testsControl.setValue(testsControl.value); // Trigger a validation
    testsControl.markAsDirty();
    testsControl.markAsTouched();
  };
}

const validateSelectedTests: ValidatorFn = (control) => {
  const testAreSelected = Object.keys(control.value)
    .map(key => control.value[key])
    .some(value => value);

  if (!testAreSelected) {
    return { required: true };
  }

  return null;
}