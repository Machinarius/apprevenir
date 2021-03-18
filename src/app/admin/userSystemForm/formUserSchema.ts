import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { PersonalInfoFormKeys } from "./forms/FormKeys";

type FormValidationTuple = [string] | [string | { value: string, disabled?: boolean } , ValidatorFn];
type PersonalInfoFormSchema = Record<PersonalInfoFormKeys, FormValidationTuple>;

export function buildPersonalInfoForm(formBuilder: FormBuilder, isEditingProfile: boolean): FormGroup {

    let passwordValidators: ValidatorFn[] = [];
    
    const personalInfoFormSchema: PersonalInfoFormSchema = {
        name: ['', Validators.required],
        lastName: ['', Validators.required],
        lastNameTwo: ['', Validators.required],
        status: ['', Validators.required],
        maritalStatus: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        emailAddress: [{ value: '', disabled: isEditingProfile }, Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.compose([...passwordValidators, Validators.minLength(8), Validators.maxLength(16)])],
        passwordConfirmation: ['', Validators.compose(passwordValidators)],
        currentPassword: ['']
    };
  
    return formBuilder.group(personalInfoFormSchema, {
        validators: [
          buildPasswordChangeValidator(isEditingProfile), 
          buildPasswordEditMinLengthOverride(isEditingProfile),
          passwordConfirmationValidator
        ]
    });
}

function buildPasswordEditMinLengthOverride(isEditingProfile: boolean): (group: FormGroup) => ValidationErrors | null {
    if (!isEditingProfile) {
      return () => null;
    }
  
    return (group: FormGroup) => {
      const passwordControl = group.get("password");
      if (!passwordControl?.value) {
        passwordControl?.markAsPristine();
        passwordControl?.setErrors(null);
      }
  
      return null;
    };
}
  
function buildPasswordChangeValidator(isEditingProfile: boolean): (group: FormGroup) => ValidationErrors | null {
    if (!isEditingProfile) {
      return () => null;
    }
  
    return (group: FormGroup) => {
      const passwordControl = group.get("password");
      const currentPwControl = group.get("currentPassword");
      const confirmationControl = group.get("passwordConfirmation");
  
      if ((passwordControl?.value || confirmationControl?.value) && !currentPwControl?.value) {
        currentPwControl.markAsTouched();
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