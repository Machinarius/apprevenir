import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { getEmailFieldDefinition } from "@services/forms/emailAddress";
import { ClientTypes, CompanyUser, EducationalInstitutionUser, EducationBureauUser, TerritorialEntityUser, Test, UniversityUser, User } from "@typedefs/backend";
import { UserInputTerm } from "./models/UserInputTerm";
import { UserZone } from "./models/UserZone";
import { TerritorialEntityCommune, TerritorialEntityNeighborhood, ZoneType } from "@typedefs/backend/userData/TerritorialEntityUser";
import { Color } from "@angular-material-components/color-picker";

const COLOR_STRING_REGEX = /#?([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})/;

export type ClientFormKeys =
  | "clientType"
  | "names"
  | "phone"
  | "nationalId"
  | "email"
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
    brandColor: ['', validateColor],
    brandImageFiles: [{ value: null, disabled: true }, generateBrandImageFileValidator(isEditing)],
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

export function loadUserIntoForm(user: User, formGroup: FormGroup) {
  if (typeof user.profile.country_id === "number") {
    formGroup.get('state').enable();
  } 

  if (typeof user.profile.state_id === "number") {
    formGroup.get('city').enable();
  }

  formGroup.get('clientType').setValue(user.client);
  formGroup.get('email').setValue(user.email);
  formGroup.get('names').setValue(user.profile.first_names),
  formGroup.get('phone').setValue(user.profile.phone);
  formGroup.get('country').setValue(user.profile.country_id, { emitEvent: false });
  formGroup.get('state').setValue(user.profile.state_id, { emitEvent: false });
  formGroup.get('city').setValue(user.profile.city_id, { emitEvent: false });

  // @ts-expect-error
  formGroup.get('nationalId').setValue(user.profile.client_config?.national_id);
  // @ts-expect-error
  const brandColorString = user.profile.client_config?.brand_color as string;
  const colorMatches = brandColorString.match(COLOR_STRING_REGEX);
  if (colorMatches.length === 4) {
    const rValue = parseInt(colorMatches[1], 16);
    const gValue = parseInt(colorMatches[2], 16);
    const bValue = parseInt(colorMatches[3], 16);

    if (![rValue, gValue, bValue].some(isNaN)) {
      const colorValue = new Color(rValue, gValue, bValue);
      formGroup.get('brandColor').setValue(colorValue);
    }
  }

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

  formGroup.get('email').disable();
  formGroup.get('clientType').disable();
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
  formGroup.get('urbanZones').patchValue(
    user.clientTypeConfig.communes[ZoneType.Urban].map(parseCommuneIntoZoneModel)
  );
  formGroup.get('ruralZones').patchValue(
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

function generateBrandImageFileValidator(editModeIsEnabled: boolean): ValidatorFn {
  return (control) => {
    if (editModeIsEnabled) {
      return null;
    }

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
  if (!COLOR_STRING_REGEX.test(control.value?.hex)) {
    return { required: true };
  }

  return null;
}