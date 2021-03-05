import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import loadUniversities from './constants/universitiesDataSource';
import { ReferralSources } from "./constants/referralSources";
import { MaritalStatusValues } from "./constants/maritalStatusValues";
import { EducationLevels } from './constants/educationLevels';
import { BackendClientTypes } from '@typedefs/backend';
import { HierarchyNode } from './referralHierarchy/HierarchyNode';
import { buildRootHierarchy } from "./referralHierarchy/builders/hierarchyBuilder";

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
  referralSources = ReferralSources;
  rootReferralHierarchy: HierarchyNode | null = null;
  maritalStatusValues = MaritalStatusValues;
  educationLevels = EducationLevels;
  universities: { id: number, label: string }[] = [];

  constructor(private _formBuilder: FormBuilder) {
    this.referralHierarchyRequiredValidator = this.referralHierarchyRequiredValidator.bind(this);
    this.dateValidator = this.dateValidator.bind(this);
    this.onReferralSourceChanged = this.onReferralSourceChanged.bind(this);
  }

  get selectedReferralSource() {
    return this.personalInfoFormGroup.get('referralSource').value;
  }

  get referralHierarchyMustBeShown() {
    if (!this.personalInfoFormGroup) {
      return false;
    }

    return !!this.selectedReferralSource && this.selectedReferralSource !== BackendClientTypes.NaturalPerson;
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
      referralSource: ['', Validators.required],
      referralHierarchy1: ['', this.referralHierarchyRequiredValidator],
      referralHierarchy2: [''],
      referralHierarchy3: [''],
      referralHierarchy4: [''],
      referralHierarchy5: [''],
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
    this.universities = await loadUniversities();
    this.loadingData = false;
  }

  public referralHierarchyRequiredValidator(control: AbstractControl): ValidationErrors {
    if (!this.referralHierarchyMustBeShown) {
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

  public async onReferralSourceChanged() {
    this.rootReferralHierarchy = null;
    [1, 2, 3, 4, 5].forEach(
      index => this.personalInfoFormGroup.get('referralHierarchy' + index).setValue('')
    );

    if (!this.referralHierarchyMustBeShown) {
      return;
    }
    
    this.loadingData = true;
    this.rootReferralHierarchy = await buildRootHierarchy(this.selectedReferralSource);
    this.loadingData = false;
  }
}
