export type PersonalInfoFormKeys =
  | "name"
  | "lastName"
  | "lastNameTwo"
  | "status"
  | "maritalStatus"
  | "phoneNumber"
  | "emailAddress"
  | "password"
  | "passwordConfirmation"
  | "currentPassword";
  

type AllFormKeys = PersonalInfoFormKeys;
export type RawFormData = Record<Exclude<AllFormKeys, "">, string | number>;