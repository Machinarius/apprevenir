import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { BackendClientTypes } from "@typedefs/backend";
import { PersonalInfoFormKeys, LocationFormKeys, LoginFormKeys } from "../forms/FormKeys";
import * as dayjs from "dayjs";

type FormValidationTuple = [string] | [string, ValidatorFn];
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
    maidenName: ['', Validators.required],
    lastName: ['', Validators.required],
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
  let passwordValidators: ValidatorFn[] = [];
  if (!isEditingProfile) {
    passwordValidators = [Validators.required];
  }

  const loginFormSchema: LoginFormSchema = {
    phoneNumber: ['', Validators.required],
    emailAddress: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.compose([...passwordValidators, Validators.minLength(8), Validators.maxLength(16)])],
    passwordConfirmation: ['', Validators.compose(passwordValidators)],
    currentPassword: ['']
  };

  return formBuilder.group(loginFormSchema, {
    validators: [buildPasswordChangeValidator(isEditingProfile), passwordConfirmationValidator]
  });
}

function buildPasswordChangeValidator(isEditingProfile: boolean): (group: FormGroup) => ValidationErrors | null {
  if (!isEditingProfile) {
    return () => null;
  }

  return (group: FormGroup) => {
    const passwordControl = group.get("password");
    const currentPwControl = group.get("currentPassword");

    if (passwordControl?.value && !currentPwControl?.value) {
      currentPwControl.setErrors({ missing: true });
    } else {
      currentPwControl.setErrors(null);
    }

    return null;
  };
}

function passwordConfirmationValidator(group: FormGroup): ValidationErrors | null {
  const passwordControl = group.get("password");
  const confirmationControl = group.get("passwordConfirmation");

  if (passwordControl?.value !== confirmationControl?.value) {
    confirmationControl?.setErrors({ doesNotMatchPassword: true });
    return null;
  }

  confirmationControl?.setErrors(null);
  return null;
}

function referralHierarchyValidator(group: FormGroup): ValidationErrors | null {
  const referralTypeControl = group.get("referralHierarchy1");
  const selectedReferralSource = group.get("referralSource").value;
  const referralHierarchyMustBeShown = 
    typeof selectedReferralSource === "string" && 
    selectedReferralSource !== BackendClientTypes.NaturalPerson;
  
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