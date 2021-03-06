import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { ReferralSources } from "../constants/referralSources";
import { MaritalStatusValues } from "../constants/maritalStatusValues";
import { EducationLevels } from '../constants/educationLevels';
import { BackendCity, BackendClientTypes, BackendCountry, BackendState } from '@typedefs/backend';
import { HierarchyNode } from '../referralHierarchy/HierarchyNode';
import { buildRootHierarchy } from "../referralHierarchy/builders/hierarchyBuilder";
import { getCities, getCountries, getStates } from '@services/geoData/geoDataSource';
import { LocationFormGroup, LoginFormGroup, PersonalInfoFormGroup } from '../forms/FormKeys';
import { RegistrationResult, submitRegistrationForms } from '../forms/registrationSubmitHandler';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { loadProfileFormData } from '../forms/profileFormLoader';

@Component({
  selector: 'profile-form',
  templateUrl: './profileForm.component.html',
  styleUrls: ['./profileForm.component.scss']
})
export class ProfileFormComponent implements OnInit {
  @Input("profile-update") profileUpdateModeEnabled: boolean;

  personalInfoFormGroup: FormGroup;
  locationFormGroup: FormGroup;
  loginFormGroup: FormGroup;
  
  referralSources = ReferralSources;
  rootReferralHierarchy: HierarchyNode | null = null;

  maritalStatusValues = MaritalStatusValues;
  educationLevels = EducationLevels;

  countries: BackendCountry[] | null = null;
  states: BackendState[] | null = null;
  cities: BackendCity[] | null = null;

  constructor(private _formBuilder: FormBuilder, private router: Router) {
    this.referralHierarchyRequiredValidator = this.referralHierarchyRequiredValidator.bind(this);
    this.dateValidator = this.dateValidator.bind(this);
    this.onReferralSourceChanged = this.onReferralSourceChanged.bind(this);
    this.onCountryChanged = this.onCountryChanged.bind(this);
    this.onStateChanged = this.onStateChanged.bind(this);
    this.passwordConfirmationValidator = this.passwordConfirmationValidator.bind(this);
    this.onSubmitClicked = this.onSubmitClicked.bind(this);
    this.handleRegistrationResult = this.handleRegistrationResult.bind(this);
    this.loadProfileFormDataIfNeeded = this.loadProfileFormDataIfNeeded.bind(this);
    this.showLoadingIndicator = this.showLoadingIndicator.bind(this);
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
    } as PersonalInfoFormGroup);

    this.locationFormGroup = this._formBuilder.group({
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required]
    } as LocationFormGroup);

    this.loginFormGroup = this._formBuilder.group({
      phoneNumber: ['', Validators.required],
      emailAddress: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])],
      passwordConfirmation: ['', Validators.compose([Validators.required, this.passwordConfirmationValidator])]
    } as LoginFormGroup);

    await this.showLoadingIndicator(async () => {
      this.countries = await getCountries();
      await this.loadProfileFormDataIfNeeded();
    });
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
    
    await this.showLoadingIndicator(async () => {
      this.rootReferralHierarchy = await buildRootHierarchy(this.selectedReferralSource);
    });
  }

  public async onCountryChanged() {
    const selectedCountryId = this.locationFormGroup.get('country').value;
    if (!selectedCountryId) {
      return;
    }

    this.locationFormGroup.get('state').setValue('');
    this.locationFormGroup.get('city').setValue('');
    this.cities = null;

    await this.showLoadingIndicator(async () => {
      this.states = await getStates(selectedCountryId);
    });
  }

  public async onStateChanged() {
    const selectedStateId = this.locationFormGroup.get('state').value;
    if (!selectedStateId) {
      return;
    }

    this.locationFormGroup.get('city').setValue('');

    await this.showLoadingIndicator(async () => {
      this.cities = await getCities(selectedStateId);
    });
  }

  public async onSubmitClicked() {
    const allForms = [
      this.personalInfoFormGroup, 
      this.locationFormGroup, 
      this.loginFormGroup
    ];

    const formsAreValid = allForms.reduce(
      (formsValid, form) => {
        form.markAllAsTouched();
        form.markAsDirty();
        return formsValid && form.valid;
      }, true
    );
    
    if (!formsAreValid) {
      return;
    }
    
    await this.showLoadingIndicator(async () => {
      try {
        const result = await submitRegistrationForms(...allForms);
        this.handleRegistrationResult(result);
      } catch (error) {
        console.error("Error while trying to submit the registration data", error);
        this.handleRegistrationResult({ wasSuccessful: false, errorMessages: [] });
      }
    });
  }

  async handleRegistrationResult(result: RegistrationResult) {
    if (result.wasSuccessful) {
      await Swal.fire("Bienvenido", "Has sido registrado exitosamente. Utiliza tu correo y contraseña para ingresar.", "success");

      this.router.navigate(['']); 
      return;
    }

    let errorMessage = "No fue posible contactar el servidor. Por favor revisa tu conexión a internet e inténtalo de nuevo";
    if (result.errorMessages.length) {
      errorMessage = "Por favor revisa los datos ingresados e inténtalo de nuevo: " + result.errorMessages.join(", ");
    }

    Swal.fire("Error", errorMessage, "error");
  }

  async loadProfileFormDataIfNeeded() {
    if (!this.profileUpdateModeEnabled) {
      return;
    }

    const currentFormData = await loadProfileFormData();
    this.rootReferralHierarchy = await buildRootHierarchy(
      currentFormData.personalInfo.referralSource as BackendClientTypes
    );

    this.personalInfoFormGroup.patchValue(currentFormData.personalInfo);
    this.locationFormGroup.patchValue(currentFormData.location);
    this.loginFormGroup.patchValue(currentFormData.login);
    
    await this.onCountryChanged();
    await this.onStateChanged();
  }

  loadingReferences = 0;
  async showLoadingIndicator<TReturn>(promiseFactory: () => Promise<TReturn>): Promise<TReturn> {
    this.loadingReferences++;
    const result = await promiseFactory();
    this.loadingReferences--;
    return result;
  }

  get loadingData() {
    return this.loadingReferences > 0;
  }
}
