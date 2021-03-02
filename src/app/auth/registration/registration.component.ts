import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import loadFakeUniversities from './constants/fakeUniversities';
import { OnboardingSources, OnboardingSourcesKeys } from "./constants/onboardingSources";
import { MaritalStatusValues } from "./constants/maritalStatusValues";
import { EducationLevels } from './constants/educationLevels';

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
  maritalStatusValues = MaritalStatusValues;
  educationLevels = EducationLevels;
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

  get genderSelectionIsInvalid() {
    if (!this.personalInfoFormGroup) {
      return false;
    }

    const control = this.personalInfoFormGroup.get('gender');
    return control.dirty && control.hasError('required');
  }

  onProfileNextClicked() {
    this.personalInfoFormGroup.get('gender').markAsDirty();
  }

  async ngOnInit(): Promise<void> {
    this.personalInfoFormGroup = this._formBuilder.group({
      onboardingSource: ['', Validators.required],
      university: ['', this.universityRequiredValidator],
      name: ['', Validators.required],
      maidenName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.compose([Validators.required, this.dateValidator])],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      educationLevel: ['', Validators.required]
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
