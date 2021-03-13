export type ReferralHierarchyLevels = 1 | 2 | 3 | 4 | 5;
export type ReferralHierarchyKeys = 
  | "referralHierarchy1"
  | "referralHierarchy2"
  | "referralHierarchy3"
  | "referralHierarchy4"
  | "referralHierarchy5";

export type PersonalInfoFormKeys =
  | "referralSource"
  | ReferralHierarchyKeys
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
  | "passwordConfirmation"
  | "currentPassword";

type AllFormKeys = PersonalInfoFormKeys | LocationFormKeys | LoginFormKeys;
export type RawFormData = Record<Exclude<AllFormKeys, "birthDate">, string | number> & { birthDate: Date };