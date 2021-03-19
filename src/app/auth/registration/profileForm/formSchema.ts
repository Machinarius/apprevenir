import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { ClientTypes } from "@typedefs/backend";
import { PersonalInfoFormKeys, LocationFormKeys, LoginFormKeys } from "../forms/FormKeys";
import * as dayjs from "dayjs";
import { 
  buildPasswordChangeValidator, 
  buildPasswordEditMinLengthOverride,
  passwordConfirmationValidator, 
  getPasswordFieldValidators,
  getPasswordConfirmationFieldValidator, 
  CURRENT_PASSWORD_KEY,
  PASSWORD_CONFIRMATION_KEY, 
  PASSWORD_KEY
} from "@services/forms/passwordValidators";
import { getEmailFieldDefinition } from "@services/forms/emailAddress";

type FormValidationTuple = [string] | [string | { value: string, disabled?: boolean } , ValidatorFn];
type PersonalInfoFormSchema = Record<PersonalInfoFormKeys, FormValidationTuple>;
type LocationFormSchema = Record<LocationFormKeys, FormValidationTuple>;
type LoginFormSchema = Record<LoginFormKeys, FormValidationTuple>;

export function buildPersonalInfoFormGroup(formBuilder: FormBuilder): FormGroup {
  const personalInfoFormSchema: PersonalInfoFormSchema = {
    referralSource: ['', Validators.required],
    referralHierarchy1: [''], // This is validated in-directly by the referralHierarchyValidator below
    referralHierarchy2: [''],
    referralHierarchy3: [''],
    referralHierarchy4: [''],
    referralHierarchy5: [''],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    lastNameTwo: ['', Validators.required],
    birthDate: ['', Validators.compose([Validators.required, dateValidator])],
    gender: ['', Validators.required],
    maritalStatus: ['', Validators.required],
    educationLevel: ['', Validators.required]
  };

  return formBuilder.group(personalInfoFormSchema, {
    validators: [referralHierarchyValidator]
  });
}

export function buildLocationFormGroup(formBuilder: FormBuilder): FormGroup {
  const locationFormSchema: LocationFormSchema = {
    country: ['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required]
  };

  return formBuilder.group(locationFormSchema);
}

export function buildLoginFormGroup(formBuilder: FormBuilder, isEditingProfile: boolean): FormGroup {
  const loginFormSchema: LoginFormSchema = {
    phoneNumber: ['', Validators.required],
    emailAddress: getEmailFieldDefinition(isEditingProfile),
    [PASSWORD_KEY]: ['', getPasswordFieldValidators(isEditingProfile)],
    [PASSWORD_CONFIRMATION_KEY]: ['', getPasswordConfirmationFieldValidator()],
    [CURRENT_PASSWORD_KEY]: ['']
  };

  return formBuilder.group(loginFormSchema, {
    validators: [
      buildPasswordChangeValidator(isEditingProfile), 
      buildPasswordEditMinLengthOverride(isEditingProfile),
      passwordConfirmationValidator
    ]
  });
}

function referralHierarchyValidator(group: FormGroup): ValidationErrors | null {
  const referralTypeControl = group.get("referralHierarchy1");
  const selectedReferralSource = group.get("referralSource").value;
  const referralHierarchyMustBeShown = 
    typeof selectedReferralSource === "string" && 
    selectedReferralSource !== ClientTypes.NaturalPerson;
  
  if (!referralHierarchyMustBeShown || !!referralTypeControl.value) {
    referralTypeControl.setErrors(null);
  } else {
    referralTypeControl.setErrors({ required: true });
  }

  return null;
}

function dateValidator(control: AbstractControl): ValidationErrors {
  if (!control.value) {
    return null;
  }

  const possibleDate = dayjs(control.value);
  if (!possibleDate.isValid()) {
    return { required: true };
  }

  return null;
}