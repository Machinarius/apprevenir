import { ValidatorFn } from "@angular/forms";

export type PersonalInfoFormKeys =
  | "referralSource"
  | "referralHierarchy1"
  | "referralHierarchy2"
  | "referralHierarchy3"
  | "referralHierarchy4"
  | "referralHierarchy5"
  | "name"
  | "maidenName"
  | "lastName"
  | "birthDate"
  | "gender"
  | "maritalStatus"
  | "educationLevel";

export type LocationFormKeys =
  | "country"
  | "state"
  | "city";

export type LoginFormKeys = 
  | "phoneNumber"
  | "emailAddress"
  | "password"
  | "passwordConfirmation";

type AllFormKeys = PersonalInfoFormKeys | LocationFormKeys | LoginFormKeys;

export type FormValidationTuple = [string] | [string, ValidatorFn];
export type PersonalInfoFormSchema = Record<PersonalInfoFormKeys, FormValidationTuple>;
export type LocationFormSchema = Record<LocationFormKeys, FormValidationTuple>;
export type LoginFormSchema = Record<LoginFormKeys, FormValidationTuple>;

export type RawFormData = Record<Exclude<AllFormKeys, "birthDate">, string | number> & { birthDate: Date };