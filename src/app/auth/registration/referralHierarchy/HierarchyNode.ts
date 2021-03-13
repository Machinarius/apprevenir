export interface HierarchyNode {
  label: string,
  depth: number,
  choices: { key: string, value: string}[],
  descendants: { [key: string]: HierarchyNode | undefined } 
}