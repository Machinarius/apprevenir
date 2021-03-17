import { UserInputTerm } from "./UserInputTerm";

export interface ZoneInputConfig {
  zoneTypeName: string,
  zoneNameInputLabel: string,
  zoneNameRequiredMessage: string,
  childrenInputTitle: string,
  childrenInputDescription: string,
  childrenRequiredMessage: string,
  currentZoneName: string,
  currentChildTerms: UserInputTerm[]
}