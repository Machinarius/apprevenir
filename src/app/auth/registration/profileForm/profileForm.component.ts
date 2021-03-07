import { Component, Input, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { ReferralSources } from "../constants/referralSources";
import { MaritalStatusValues } from "../constants/maritalStatusValues";
import { EducationLevels } from '../constants/educationLevels';
import { BackendCity, BackendClientTypes, BackendCountry, BackendState } from '@typedefs/backend';
import { HierarchyNode } from '../referralHierarchy/HierarchyNode';
import { buildRootHierarchy } from "../referralHierarchy/builders/hierarchyBuilder";
import { getCities, getCountries, getStates } from '@services/geoData/geoDataSource';
import { RegistrationResult, submitRegistrationForms } from '../forms/registrationSubmitHandler';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { loadProfileFormData } from '../forms/profileFormLoader';
import { buildLocationFormGroup, buildLoginFormGroup, buildPersonalInfoFormGroup } from './formSchema';

@Component({
  selector: 'profile-form',
  templateUrl: './profileForm.component.html',
  styleUrls: ['./profileForm.component.scss']
})
export class ProfileFormComponent implements OnInit {
  @Input("profile-update") profileUpdateModeEnabled: boolean;
  @Input("admin-mode") adminModeEnabled: boolean;
  @Input("user-id-override") userIdOverride: string | null;

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

  constructor(
    private _formBuilder: FormBuilder, private _router: Router,
    private _location: Location
  ) {
    this.profileUpdateModeEnabled = !!this.profileUpdateModeEnabled;
    this.adminModeEnabled = !!this.adminModeEnabled;

    this.onReferralSourceChanged = this.onReferralSourceChanged.bind(this);
    this.onCountryChanged = this.onCountryChanged.bind(this);
    this.onStateChanged = this.onStateChanged.bind(this);
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
    this.personalInfoFormGroup = buildPersonalInfoFormGroup(this._formBuilder);
    this.locationFormGroup = buildLocationFormGroup(this._formBuilder);
    this.loginFormGroup = buildLoginFormGroup(this._formBuilder, this.profileUpdateModeEnabled);

    await this.showLoadingIndicator(async () => {
      this.countries = await getCountries();
      await this.loadProfileFormDataIfNeeded();
    });
  }

  public async onReferralSourceChanged() {
    this.rootReferralHierarchy = null;
    [1, 2, 3, 4, 5].forEach(
      index => {
        const hierarchyKey = 'referralHierarchy' + index;
        this.personalInfoFormGroup.get(hierarchyKey).setValue('');
      }
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
        const result = await submitRegistrationForms(this.profileUpdateModeEnabled, this.adminModeEnabled, ...allForms);
        this.handleRegistrationResult(result);
      } catch (error) {
        console.error("Error while trying to submit the registration data", error);
        this.handleRegistrationResult({ wasSuccessful: false, errorMessages: [] });
      }
    });
  }

  async handleRegistrationResult(result: RegistrationResult) {
    if (result.wasSuccessful) {
      let successTitle = "Bienvenido";
      let successMessage = "Has sido registrado exitosamente. Utiliza tu correo y contraseña para ingresar.";
      
      if (this.profileUpdateModeEnabled) {
        successTitle = "Perfil Actualizado";
        successMessage = "Tus datos han sido actualizados correctamente";
      }

      if (this.adminModeEnabled) {
        if (this.profileUpdateModeEnabled) {
          successTitle = "Perfil Actualizado";
          successMessage = "Los datos del usuario han sido actualizados";
        } else {
          successTitle = "Usuario creado";
          successMessage = "El usuario ha sido creado correctamente";
        }
      }
      
      await Swal.fire(successTitle, successMessage, "success");

      if (this.profileUpdateModeEnabled) {
        this._location.back();
      } else {
        this._router.navigate(['']); 
      }
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

    const currentFormData = await loadProfileFormData(this.userIdOverride);
    if (currentFormData.personalInfo.referralSource) {
      this.rootReferralHierarchy = await buildRootHierarchy(
        currentFormData.personalInfo.referralSource as BackendClientTypes
      );
    }

    if (typeof currentFormData.location.country === "number") {
      this.states = await getStates(currentFormData.location.country);
    }

    if (typeof currentFormData.location.state === "number") {
      this.cities = await getCities(currentFormData.location.state);
    }

    this.personalInfoFormGroup.patchValue(currentFormData.personalInfo);
    this.locationFormGroup.patchValue(currentFormData.location);
    this.loginFormGroup.patchValue(currentFormData.login);
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
