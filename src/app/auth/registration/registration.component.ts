import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { ReferralSources } from "./constants/referralSources";
import { MaritalStatusValues } from "./constants/maritalStatusValues";
import { EducationLevels } from './constants/educationLevels';
import { BackendCity, BackendClientTypes, BackendCountry, BackendState } from '@typedefs/backend';
import { HierarchyNode } from './referralHierarchy/HierarchyNode';
import { buildRootHierarchy } from "./referralHierarchy/builders/hierarchyBuilder";
import { getCities, getCountries, getStates } from '@services/geoData/geoDataSource';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  personalInfoFormGroup: FormGroup;
  locationFormGroup: FormGroup;
  loginFormGroup: FormGroup;

  isEditable = false;

  loadingData = true;
  referralSources = ReferralSources;
  rootReferralHierarchy: HierarchyNode | null = null;
  maritalStatusValues = MaritalStatusValues;
  educationLevels = EducationLevels;

  countries: BackendCountry[] | null = null;
  states: BackendState[] | null = null;
  cities: BackendCity[] | null = null;

  constructor(private _formBuilder: FormBuilder) {
    this.referralHierarchyRequiredValidator = this.referralHierarchyRequiredValidator.bind(this);
    this.dateValidator = this.dateValidator.bind(this);
    this.onReferralSourceChanged = this.onReferralSourceChanged.bind(this);
    this.onCountryChanged = this.onCountryChanged.bind(this);
    this.onStateChanged = this.onStateChanged.bind(this);
    this.passwordConfirmationValidator = this.passwordConfirmationValidator.bind(this);
    this.onSubmitClicked = this.onSubmitClicked.bind(this);
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

    this.locationFormGroup = this._formBuilder.group({
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required]
    });

    this.loginFormGroup = this._formBuilder.group({
      phoneNumber: ['', Validators.required],
      emailAddress: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])],
      passwordConfirmation: ['', Validators.compose([Validators.required, this.passwordConfirmationValidator])]
    });

    this.loadingData = true;
    this.countries = await getCountries();
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

  public passwordConfirmationValidator(control: AbstractControl): ValidationErrors {
    if (!this.loginFormGroup) {
      return null;
    }

    const password = this.loginFormGroup.get('password').value;
    if (password !== control.value) {
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

  public async onCountryChanged() {
    const selectedCountryId = this.locationFormGroup.get('country').value;
    if (!selectedCountryId) {
      return;
    }

    this.locationFormGroup.get('state').setValue('');
    this.locationFormGroup.get('city').setValue('');
    this.cities = null;

    this.loadingData = true;
    this.states = await getStates(selectedCountryId);
    this.loadingData = false;
  }

  public async onStateChanged() {
    const selectedStateId = this.locationFormGroup.get('state').value;
    if (!selectedStateId) {
      return;
    }

    this.locationFormGroup.get('city').setValue('');

    this.loadingData = true;
    this.cities = await getCities(selectedStateId);
    this.loadingData = false;
  }

  public onSubmitClicked() {
    const formsAreValid = [
      this.personalInfoFormGroup, 
      this.locationFormGroup, 
      this.loginFormGroup
    ].reduce(
      (formsValid, form) => {
        form.markAllAsTouched();
        form.markAsDirty();
        return formsValid && form.valid;
      }, true
    );
    
    if (!formsAreValid) {
      return;
    }

    throw new Error("Not implemented");
  }
}
