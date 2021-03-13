import { ReferralHierarchyLevels } from "../../forms/FormKeys";

export interface HierarchyNode {
  label: string,
  depth: ReferralHierarchyLevels,
  choices: { key: string, value: string}[],
  descendants: { [key: string]: HierarchyNode | undefined } 
}