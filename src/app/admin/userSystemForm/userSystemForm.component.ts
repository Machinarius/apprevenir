import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaritalStatusValues } from "../../auth/registration/constants/maritalStatusValues";
import { RegistrationResult, submitRegistrationForms } from './forms/registrationSubmitHandler';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { buildPersonalInfoForm } from './formUserSchema';
import { loadProfileFormData } from './forms/profileSystemFormLoader';
import { LoaderComponent } from 'src/app/core/loader/loader.component';
import { getStoredProfileInfo } from "@services/auth/authStore";

@Component({
    selector: 'user-system-form',
    templateUrl: './userSystemForm.component.html',
    styleUrls: ['./userSystemForm.component.scss']
})

export class UserSystemFormComponent implements OnInit {

    @Input("profile-update") profileUpdateModeEnabled: boolean;
    @Input("admin-mode") adminModeEnabled: boolean;
    @Input("user-id-override") userIdOverride: string | null;

    @ViewChild(LoaderComponent) loader: LoaderComponent;

    personalInfoForm: FormGroup;

    maritalStatusValues = MaritalStatusValues;
    hiddenStatus = false;

    constructor(
        private _formBuilder: FormBuilder, 
        private _router: Router,
    ) {
        this.profileUpdateModeEnabled = !!this.profileUpdateModeEnabled;
        this.adminModeEnabled = !!this.adminModeEnabled;

        this.onSubmitClicked = this.onSubmitClicked.bind(this);
        this.handleRegistrationResult = this.handleRegistrationResult.bind(this);
        this.loadProfileFormDataIfNeeded = this.loadProfileFormDataIfNeeded.bind(this);
      }

    get statusSelectionIsInvalid() {
        if (!this.personalInfoForm) {
          return false;
        }
    
        const control = this.personalInfoForm.get('status');
        return control.dirty && control.hasError('required');
    }
    
    async ngOnInit(): Promise<void> {
        this.personalInfoForm = buildPersonalInfoForm(this._formBuilder, this.profileUpdateModeEnabled);
    }

    async ngAfterViewInit() {
      await this.loader.showLoadingIndicator(async () => {
        await this.loadProfileFormDataIfNeeded();
      });
    }

    public async onSubmitClicked() {

        this.personalInfoForm.get('status').markAsDirty();

        const allForms = [
          this.personalInfoForm, 
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
        
        try {
            const result = await submitRegistrationForms(this.profileUpdateModeEnabled, this.adminModeEnabled, ...allForms);
            this.handleRegistrationResult(result);
        } catch (error) {
            console.error("Error while trying to submit the registration data", error);
            this.handleRegistrationResult({ wasSuccessful: false, errorMessages: [] });
        } 
    }

    async handleRegistrationResult(result: RegistrationResult) {
        if (result.wasSuccessful) {
          let successTitle = "Usuario creado";
          let successMessage = "El usuario ha sido creado correctamente";

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

          this._router.navigate(['app/admin/edit-system-user']); 
    
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
      const currentProfile = getStoredProfileInfo();
      let userId = currentProfile.id;
      if (userId == currentFormData.id) {
        this.hiddenStatus = true;
      }
      this.personalInfoForm.patchValue(currentFormData.personalInfo);
    }
}