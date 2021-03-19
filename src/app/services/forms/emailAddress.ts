import { ValidatorFn, Validators } from "@angular/forms";

export function getEmailFieldDefinition(isEditingProfile: boolean): [{ value: string, disabled?: boolean }, ValidatorFn] {
  return [{ value: '', disabled: isEditingProfile }, Validators.compose([Validators.required, Validators.email])];
}