import { ZoneType } from "@typedefs/backend";
import { UserInputTerm } from "./UserInputTerm";

export class UserZone {
  public id: number | null;
  public name: string;
  public type: ZoneType;
  public editedByUser: boolean;
  public deletedByUser: boolean;
  public children: UserInputTerm[] = [];

  public get activeChildren() {
    return this.children.filter(child => !child.deletedByUser);
  }

  public get childrenStrings() {
    return this.activeChildren.map(child => child.label).join(", ");
  }

  public get cameFromServer() {
    return this.id !== null;
  }
}