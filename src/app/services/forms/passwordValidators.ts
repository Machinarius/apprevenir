import { FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

export const PASSWORD_KEY = "password";
export const PASSWORD_CONFIRMATION_KEY = "passwordConfirmation";
export const CURRENT_PASSWORD_KEY = "currentPassword";

export function buildPasswordEditMinLengthOverride(isEditingProfile: boolean): (group: FormGroup) => ValidationErrors | null {
  if (!isEditingProfile) {
    return () => null;
  }

  return (group: FormGroup) => {
    const passwordControl = group.get(PASSWORD_KEY);
    if (!passwordControl?.value) {
      passwordControl?.markAsPristine();
      passwordControl?.setErrors(null);
    }

    return null;
  };
}

export function buildPasswordChangeValidator(isEditingProfile: boolean): (group: FormGroup) => ValidationErrors | null {
  if (!isEditingProfile) {
    return () => null;
  }

  return (group: FormGroup) => {
    const passwordControl = group.get(PASSWORD_KEY);
    const currentPwControl = group.get(CURRENT_PASSWORD_KEY);
    const confirmationControl = group.get(PASSWORD_CONFIRMATION_KEY);

    if ((passwordControl?.value || confirmationControl?.value) && !currentPwControl?.value) {
      currentPwControl.markAsTouched();
      currentPwControl.setErrors({ missing: true });
    } else {
      currentPwControl.setErrors(null);
    }

    return null;
  };
}

export function passwordConfirmationValidator(group: FormGroup): ValidationErrors | null {
  const passwordControl = group.get(PASSWORD_KEY);
  const confirmationControl = group.get(PASSWORD_CONFIRMATION_KEY);

  if (passwordControl?.value !== confirmationControl?.value) {
    confirmationControl?.setErrors({ doesNotMatchPassword: true });
    return null;
  }

  confirmationControl?.setErrors(null);
  return null;
}

export function getPasswordFieldValidators(isEditingProfile: boolean): ValidatorFn {
  let passwordValidators: ValidatorFn[] = [];
  if (!isEditingProfile) {
    passwordValidators = [Validators.required];
  }

  return Validators.compose([...passwordValidators, Validators.minLength(8), Validators.maxLength(16)]);
}

export function getPasswordConfirmationFieldValidator(): ValidatorFn {
  return Validators.required;
}