import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { getEmailFieldDefinition } from "@services/forms/emailAddress";
import { ClientTypes, CompanyUser, EducationalInstitutionUser, EducationBureauUser, TerritorialEntityUser, Test, UniversityUser, User } from "@typedefs/backend";
import { 
  buildPasswordEditMinLengthOverride,
  getPasswordConfirmationFieldValidator, 
  getPasswordFieldValidators, 
  passwordConfirmationValidator, 
  PASSWORD_CONFIRMATION_KEY, 
  PASSWORD_KEY 
} from "@services/forms/passwordValidators";
import { UserInputTerm } from "./models/UserInputTerm";
import { UserZone } from "./models/UserZone";
import { TerritorialEntityCommune, TerritorialEntityNeighborhood, ZoneType } from "@typedefs/backend/userData/TerritorialEntityUser";

export type ClientFormKeys =
  | "clientType"
  | "names"
  | "phone"
  | "nationalId"
  | "email"
  | "password"
  | "passwordConfirmation"
  | "brandColor"
  | "brandImageFiles"
  | "country"
  | "state"
  | "city"
  | "urbanZones"
  | "ruralZones"
  | "locations"
  | "areas"
  | "shifts"
  | "schools"
  | "grades"
  | "programs"
  | "modalities"
  | "semesters"
  | "schoolGrades"
  | "selectedTests";

export type ClientFormRawValues = Record<ClientFormKeys, unknown>;

export function buildClientFormGroup(formBuilder: FormBuilder, isEditing: boolean): FormGroup {
  return formBuilder.group({
    clientType: ['', Validators.required],
    names: ['', Validators.required],
    phone: ['', Validators.required],
    nationalId: ['', Validators.required],
    email: getEmailFieldDefinition(isEditing),
    [PASSWORD_KEY]: ['', getPasswordFieldValidators(isEditing)],
    [PASSWORD_CONFIRMATION_KEY]: ['', getPasswordConfirmationFieldValidator()],
    brandColor: ['', validateColor],
    brandImageFiles: [{ value: null, disabled: true }, validateBrandImageFile],
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
  }, {
    validators: [
      passwordConfirmationValidator,
      buildPasswordEditMinLengthOverride(isEditing)
    ]
  });
}

export function loadUserIntoForm(user: User, formGroup: FormGroup) {
  formGroup.get(PASSWORD_KEY).disable();
  formGroup.get(PASSWORD_CONFIRMATION_KEY).disable();

  formGroup.get('clientType').setValue(user.client);
  formGroup.get('clientType').disable();

  formGroup.get('email').setValue(user.email);
  formGroup.get('email').disable();

  formGroup.get('names').setValue(user.profile.first_names),
  formGroup.get('phone').setValue(user.profile.phone);
  formGroup.get('country').setValue(user.profile.country_id);
  formGroup.get('state').setValue(user.profile.state_id);
  formGroup.get('city').setValue(user.profile.city_id);

  if (typeof user.profile.country_id === "number") {
    formGroup.get('state').enable();
  } 

  if (typeof user.profile.state_id === "number") {
    formGroup.get('city').enable();
  }

  // @ts-expect-error
  formGroup.get('nationalId').setValue(user.profile.client_config?.national_id);
  // @ts-expect-error
  formGroup.get('brandColor').setValue(user.profile.client_config?.brand_color);

  const clientType: ClientTypes = user.client as ClientTypes;
  switch (clientType) {
    case ClientTypes.Company:
      loadCompanyUserData(user as any, formGroup);
      break;
    case ClientTypes.EducationBureau:
      loadEducationBureauData(user as any, formGroup);
      break;
    case ClientTypes.EducationalInstitution:
      loadEducationalInstitutionData(user as any, formGroup);
      break;
    case ClientTypes.University:
      loadUniversityData(user as any, formGroup);
      break;
    case ClientTypes.TerritorialEntity:
      loadTerritorialEntityData(user as any, formGroup);
      break;
  }

  console.log("form state after load: ", formGroup.value);
}

function loadCompanyUserData(user: CompanyUser, formGroup: FormGroup) {
  formGroup.get('locations').setValue(user.clientTypeConfig.locations.map(location => parseObjectIntoInputTerm(location, "location")));
  formGroup.get('areas').setValue(user.clientTypeConfig.areas.map(area => parseObjectIntoInputTerm(area, "area")));
  formGroup.get('shifts').setValue(user.clientTypeConfig.schedules.map(schedule => parseObjectIntoInputTerm(schedule, "schedul")));
}

function loadEducationBureauData(user: EducationBureauUser, formGroup: FormGroup) {
  formGroup.get('schools').setValue(user.clientTypeConfig.educationalInstitutions.map(institution => parseObjectIntoInputTerm(institution, "educational_institution")));
  formGroup.get('grades').setValue(user.clientTypeConfig.grades.map(grade => parseObjectIntoInputTerm(grade, "grade")));
}

function loadEducationalInstitutionData(user: EducationalInstitutionUser, formGroup: FormGroup) {
  formGroup.get('schoolGrades').setValue(user.clientTypeConfig.educationalGrades.map(grade => parseObjectIntoInputTerm(grade, "grade")));
}

function loadUniversityData(user: UniversityUser, formGroup: FormGroup) {
  formGroup.get('programs').setValue(user.clientTypeConfig.programs.map(program => parseObjectIntoInputTerm(program, "program")));
  formGroup.get('modalities').setValue(user.clientTypeConfig.modalities.map(modality => parseObjectIntoInputTerm(modality, "modality")));
  formGroup.get('semesters').setValue(user.clientTypeConfig.semesters.map(semester => parseObjectIntoInputTerm(semester, "semester")));
}

function parseObjectIntoInputTerm<TObject extends { id: number }>(object: TObject, labelKey: keyof TObject): UserInputTerm {
  return {
    cameFromServer: true,
    deletedByUser: false,
    id: object.id,
    label: object[labelKey] as unknown as string
  };
}

function loadTerritorialEntityData(user: TerritorialEntityUser, formGroup: FormGroup) {
  formGroup.get('urbanZones').setValue(
    user.clientTypeConfig.communes[ZoneType.Urban].map(parseCommuneIntoZoneModel)
  );
  formGroup.get('ruralZones').setValue(
    user.clientTypeConfig.communes[ZoneType.Rural].map(parseCommuneIntoZoneModel)
  );
}

function parseCommuneIntoZoneModel(commune: TerritorialEntityCommune): UserZone {
  const zone = new UserZone();
  zone.id = commune.id;
  zone.name = commune.commune;
  zone.type = commune.zone_type;
  zone.children = commune.neighborhoods.map(parseNeighborhoodIntoInputTerm);
  
  return zone;
}

function parseNeighborhoodIntoInputTerm(neighborhood: TerritorialEntityNeighborhood): UserInputTerm {
  return {
    cameFromServer: true,
    deletedByUser: false,
    id: neighborhood.id,
    label: neighborhood.neighborhood
  };
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
