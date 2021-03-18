import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: 'app-edit-system-user-form',
  templateUrl: './edit-system-user-form.component.html',
  styleUrls: ['./edit-system-user-form.component.scss']
})
export class EditSystemUserFormComponent implements OnInit {

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

  ngOnInit(): void {
  }

}
