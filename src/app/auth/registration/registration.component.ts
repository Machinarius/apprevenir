import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import loadFakeUniversities from './constants/fakeUniversities';
import { OnboardingSources, OnboardingSourcesKeys } from "./constants/onboardingSources";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  personalInfoFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = false;

  loadingData = true;
  onboardingSources = OnboardingSources;
  universities: { id: number, label: string }[] = [];

  constructor(private _formBuilder: FormBuilder) {
    this.universityRequiredValidator = this.universityRequiredValidator.bind(this);
    this.dateValidator = this.dateValidator.bind(this);
  }

  get universitiesDropDownMustBeShown() {
    if (!this.personalInfoFormGroup) {
      return false;
    }

    return this.personalInfoFormGroup.get('onboardingSource').value === OnboardingSourcesKeys.UNIVERSITY;
  }

  async ngOnInit(): Promise<void> {
    this.personalInfoFormGroup = this._formBuilder.group({
      onboardingSource: ['', Validators.required],
      university: ['', this.universityRequiredValidator],
      name: ['', Validators.required],
      maidenName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.compose([Validators.required, this.dateValidator])],
      gender: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.loadingData = true;
    this.universities = await loadFakeUniversities();
    this.loadingData = false;
  }

  public universityRequiredValidator(control: AbstractControl): ValidationErrors {
    if (!this.universitiesDropDownMustBeShown) {
      return null;
    }

    if (!control.value) {
      return { required: true };
    }

    return null;
  }

  public dateValidator(control: AbstractControl): ValidationErrors {
    if (!control.value) {
      return null;
    }

    const possibleDate = new Date(control.value);
    if (possibleDate.getTime() == NaN) {
      return { required: true };
    }

    return null;
  }
}
