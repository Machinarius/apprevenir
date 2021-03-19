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
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.required],
    passwordConfirmation: ['', Validators.required],
    brandColor: ['', validateColor],
    brandImageFiles: [null, validateBrandImageFile],
    country: [ { value: '', disabled: true }, Validators.required],
    state: [ { value: '', disabled: true }, Validators.required],
    city: [ { value: '', disabled: true }, Validators.required],
    urbanZones: [[]],
    ruralZones: [[]],
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

export function storeBrandImageFiles(formGroup: FormGroup, fileList: FileList) {
  fileList["toString"] = () => fileList.item(0)?.name || "";
  formGroup.get("brandImageFiles").setValue(fileList);
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

const validateColor: ValidatorFn = (control) => {
  if (!/[A-Fa-f0-9]{6}/.test(control.value?.hex)) {
    return { required: true };
  }

  return null;
}

const validateBrandImageFile: ValidatorFn = (control) => {
  const fileList = control.value as FileList | null;
  if (!fileList || fileList.length != 1 || !fileList.item) {
    return { required: true };
  }

  const file = fileList.item(0);
  if (file.type == "image/png" || file.type == "image/jpeg") {
    return null;
  }

  return { required: true };
};