import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChipInputComponent } from '../chip-autocomplete/chip-input.component';
import { UserInputTerm } from '../models/UserInputTerm';
import { ZoneInputConfig } from '../models/ZoneInputConfig';

@Component({
  templateUrl: './zone-edit-modal.component.html',
  styleUrls: ['./zone-edit-modal.component.scss']
})
export class ZoneEditModalComponent {
  inputForm: FormGroup;

  @ViewChild(ChipInputComponent) termsInput: ChipInputComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: ZoneInputConfig,
    private dialogRef: MatDialogRef<ZoneEditModalComponent>,
    formBuilder: FormBuilder
  ) { 
    this.inputForm = formBuilder.group({
      "zoneName": [config.currentZoneName, Validators.required],
      "childTerms": [config.currentChildTerms]
    });
  }

  get childTermsAreRequired() {
    const termsControl = this.inputForm.get("childTerms");
    return termsControl.dirty && termsControl.hasError("required");
  }

  public static async show(dialog: MatDialog, input: ZoneInputConfig): Promise<ZoneEditModalResult> {
    const dialogRef = dialog.open(ZoneEditModalComponent, {
      data: input
    });
    const result = await dialogRef.afterClosed().toPromise();
    return result as ZoneEditModalResult;
  }
  
  public onCancelClicked() {
    const result: ZoneEditModalResult = {
      userConfirmed: false,
      zoneName: "",
      childTerms: []
    };
    this.dialogRef.close(result);
  }

  public onConfirmClicked() {
    this.termsInput.runValidations();
    this.inputForm.markAllAsTouched();

    if (!this.inputForm.valid) {
      return;
    }

    const result: ZoneEditModalResult = {
      userConfirmed: true,
      zoneName: this.inputForm.get("zoneName").value,
      childTerms: this.inputForm.get("childTerms").value
    };
    this.dialogRef.close(result);
  }
}

export interface ZoneEditModalResult {
  userConfirmed: boolean,
  zoneName: string,
  childTerms: UserInputTerm[]
}