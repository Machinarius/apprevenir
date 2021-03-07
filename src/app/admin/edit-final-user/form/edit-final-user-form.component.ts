import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  templateUrl: "./edit-final-user-form.component.html",
  styleUrls: ["./edit-final-user-form.component.html"]
})
export class EditFinalUserForm {
  userId: string;

  constructor(
    private _activatedroute: ActivatedRoute,
    private _location: Location
  ) {
    this.userId = _activatedroute.snapshot.paramMap.get("userId");
    if (typeof this.userId === "undefined" || this.userId === null) {
      this._location.back();
    }
  }
}