import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { getCities, getCountries, getStates } from '@services/geoData/geoDataSource';
import { City, Country, State, Test, ZoneType } from '@typedefs/backend';
import { LoaderComponent } from 'src/app/core/loader/loader.component';
import { ZoneEditModalComponent } from './zone-edit-modal/zone-edit-modal.component';
import { NewClientTypes } from './constants/newClientTypes';
import { buildClientFormGroup, configureTestsControl, loadUserIntoForm, storeBrandImageFiles } from './formSchema';
import { ZoneInputConfig } from './models/ZoneInputConfig';
import { UserZone } from './models/UserZone';
import { ClientTypes } from "@typedefs/backend/userData/ClientTypes";
import { ChipInputComponent } from './chip-autocomplete/chip-input.component';
import { getAllTests } from '@services/test/testsDataSource';
import { submitClientCreationForm } from './formSubmitter';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendError } from '@services/common';
import Swal from 'sweetalert2';
import { getUserData } from '@services/user/usersDataSource';

@Component({
  selector: 'edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements AfterViewInit {
  public color: ThemePalette = 'primary';
  public touchUi = false;

  public zoneTableColumns: string[] = [
    'name', 
    'children', 
    'actions'
  ];

  editTargetClientId: number | null = null;
  get editModeIsEnabled() {
    return this.editTargetClientId != null && !isNaN(this.editTargetClientId);
  }
  
  clientForm: FormGroup;

  countries: Country[] | null = null;
  states: State[] | null = null;
  cities: City[] | null = null;
  tests: Test[] = [];
  
  newClientTypes = NewClientTypes;

  public urbanZonesDS = new MatTableDataSource<UserZone>(this.allUrbanZones);
  public ruralZonesDS = new MatTableDataSource<UserZone>(this.allRuralZones);

  @ViewChild(LoaderComponent) loader: LoaderComponent; 

  @ViewChild("companyLocationsInput") companyLocationsInput: ChipInputComponent;
  @ViewChild("companyAreasInput") companyAreasInput: ChipInputComponent;
  @ViewChild("companyShiftsInput") companyShiftsInput: ChipInputComponent;
  @ViewChild("edBureauSchoolsInput") edBureauSchoolsInput: ChipInputComponent;
  @ViewChild("edBureauGradesInput") edBureauGradesInput: ChipInputComponent;
  @ViewChild("universityProgramsInput") universityProgramsInput: ChipInputComponent;
  @ViewChild("universityModalitiesInput") universityModalitiesInput: ChipInputComponent;
  @ViewChild("universitySemestersInput") universitySemestersInput: ChipInputComponent;
  @ViewChild("schoolGradesInput") schoolGradesInput: ChipInputComponent;

  constructor(
    private router: Router,
    private currentRoute: ActivatedRoute,
    private dialog: MatDialog,
    formBuilder: FormBuilder
  ) {
    const params = currentRoute.snapshot.paramMap;
    if (params.has("id")) {
      this.editTargetClientId = parseInt(params.get("id"));
    }

    this.clientForm = buildClientFormGroup(formBuilder, this.editModeIsEnabled);
  }

  get allUrbanZones(): UserZone[] {
    return this.clientForm?.get("urbanZones")?.value || [];
  }

  get allRuralZones(): UserZone[] {
    return this.clientForm?.get("ruralZones")?.value || [];
  }

  set allUrbanZones(zones: UserZone[]) {
    this.clientForm.get("urbanZones").setValue(zones);
  }

  set allRuralZones(zones: UserZone[]) {
    this.clientForm.get("ruralZones").setValue(zones);
  }

  get activeUrbanZones() {
    return this.allUrbanZones.filter(zone => !zone.deletedByUser);
  }

  get activeRuralZones() {
    return this.allRuralZones.filter(zone => !zone.deletedByUser);
  }

  get selectedClientType() {
    return this.clientForm.get("clientType").value as ClientTypes;
  }

  get clientIsTerritorialEntity() {
    return this.selectedClientType == ClientTypes.TerritorialEntity;
  }

  get clientIsCompany() {
    return this.selectedClientType == ClientTypes.Company;
  }

  get clientIsEducationBureau() {
    return this.selectedClientType == ClientTypes.EducationBureau;
  }

  get clientIsUniversity() {
    return this.selectedClientType == ClientTypes.University;
  }

  get clientIsEducationalInstitution() {
    return this.selectedClientType == ClientTypes.EducationalInstitution;
  }

  get userMustSelectATest(): boolean {
    const control = this.clientForm.get("selectedTests");
    return control.touched && control.hasError("required");
  }

  get userMustCreateAnUrbanZone(): boolean {
    return this.clientForm?.get("urbanZones")?.hasError("required") || false;
  }

  get userMustCreateARuralZone(): boolean {
    return this.clientForm?.get("ruralZones")?.hasError("required") || false;
  }

  async ngAfterViewInit() {
    this.allChipInputs = [
      this.companyLocationsInput,
      this.companyAreasInput,
      this.companyShiftsInput,
      this.edBureauSchoolsInput,
      this.edBureauGradesInput,
      this.universityProgramsInput,
      this.universityModalitiesInput,
      this.universitySemestersInput,
      this.schoolGradesInput
    ];

    await this.loader.showLoadingIndicator(async () => {
      const tests = await getAllTests();
      configureTestsControl(this.clientForm, tests);
      this.tests = tests;

      this.countries = await getCountries();
      this.clientForm.get('country').enable();

      await this.loadClientInfoIfNeeded();
    });
  }

  public async onCountryChanged() {
    const selectedCountryId = this.clientForm.get('country').value;
    if (!selectedCountryId) {
      return;
    }

    this.clientForm.get('state').setValue('');
    this.clientForm.get('city').setValue('');
    this.cities = null;

    await this.loader.showLoadingIndicator(async () => {
      this.states = await getStates(selectedCountryId);
      this.clientForm.get('state').enable();
    });
  }

  public async onStateChanged() {
    const selectedStateId = this.clientForm.get('state').value;
    if (!selectedStateId) {
      return;
    }

    this.clientForm.get('city').setValue('');

    await this.loader.showLoadingIndicator(async () => {
      this.cities = await getCities(selectedStateId);
      this.clientForm.get('city').enable();
    });
  }

  get selectedBrandImageFileName(): string | null {
    const files = this.clientForm.get("brandImageFiles").value as FileList | null;
    if (!files || !files.length) {
      return null;
    }

    return files.item(0).name;
  }

  onFilesSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    storeBrandImageFiles(this.clientForm, element.files);
  }

  async openRuralZoneEditDialog(currentZone?: UserZone) {
    const config: ZoneInputConfig = {
      ...ruralZoneConfigTemplate,
      currentChildTerms: [...currentZone?.children || []],
      currentZoneName: currentZone?.name || ""
    };

    const result = await ZoneEditModalComponent.show(this.dialog, config);
    if (!result.userConfirmed) {
      return;
    }

    if (currentZone) {
      currentZone.editedByUser = true;
      currentZone.name = result.zoneName;
      currentZone.children = result.childTerms;
      return;
    }
    
    const createdZone = new UserZone();
    createdZone.name = result.zoneName;
    createdZone.type = ZoneType.Rural;
    createdZone.children = result.childTerms;

    this.allRuralZones = [...this.allRuralZones, createdZone];
    this.ruralZonesDS.data = this.activeRuralZones;
  }

  deleteRuralZone(currentZone: UserZone) {
    currentZone.deletedByUser = true;
    this.ruralZonesDS.data = this.activeRuralZones;
  }

  async openUrbanZoneEditDialog(currentZone?: UserZone) {
    const config: ZoneInputConfig = {
      ...urbanZoneConfigTemplate,
      currentChildTerms: [...currentZone?.children || []],
      currentZoneName: currentZone?.name || ""
    };

    const result = await ZoneEditModalComponent.show(this.dialog, config);
    if (!result.userConfirmed) {
      return;
    }

    if (currentZone) {
      currentZone.editedByUser = true;
      currentZone.name = result.zoneName;
      currentZone.children = result.childTerms;
      return;
    }
    
    const createdZone = new UserZone();
    createdZone.name = result.zoneName;
    createdZone.type = ZoneType.Urban;
    createdZone.children = result.childTerms;

    this.allUrbanZones = [...this.allUrbanZones, createdZone];
    this.urbanZonesDS.data = this.activeUrbanZones;
  }

  deleteUrbanZone(currentZone: UserZone) {
    currentZone.deletedByUser = true;
    this.urbanZonesDS.data = this.activeUrbanZones;
  }

  allChipInputs: ChipInputComponent[] = [];

  onClientTypeChanged() {
    this.allChipInputs.forEach(input => input.clearErrorState());
  }

  runValidationsOnChipInputs() {
    this.allChipInputs.forEach(input => input.runValidations());
  }

  async loadClientInfoIfNeeded() {
    if (!this.editModeIsEnabled) {
      return;
    }

    const user = await getUserData(this.editTargetClientId);
    if (typeof user.profile.country_id === "number") {
      this.states = await getStates(user.profile.country_id);
    } 

    if (typeof user.profile.state_id === "number") {
      this.cities = await getCities(user.profile.state_id);
    }

    loadUserIntoForm(user, this.clientForm);

    this.urbanZonesDS.data = this.activeUrbanZones;
    this.ruralZonesDS.data = this.activeRuralZones;
  }

  async onSubmitClicked() {
    this.runValidationsOnChipInputs();
    this.clientForm.markAllAsTouched();

    if (!this.clientForm.valid) {
      return;
    }
    
    try {
      await this.loader.showLoadingIndicator(async () => {
        await submitClientCreationForm(this.clientForm.value);
      });

      await Swal.fire("Cliente creado", "El cliente ha sido creado con éxito", "success");
      this.router.navigate(['app/admin/clients']);

      return;
    } catch (error) {
      console.error(error);

      let errorMessage = "No fue posible contactar al servidor. Por favor revisa tu conexión a internet e inténtalo de nuevo.";
      if (error instanceof BackendError) {
        errorMessage = "Por favor revisa los datos ingresados e inténtalo de nuevo: <br />" 
          + error.errorMessages.join(", ") 
          + "<br /> Es posible que debas volver a la lista de clientes y eliminar este cliente antes de poder intentarlo de nuevo.";
      }

      Swal.fire("Error", errorMessage, "error");
    }
  }
}

const urbanZoneConfigTemplate: Omit<ZoneInputConfig, "currentChildTerms" | "currentZoneName"> = {
  zoneTypeName: "Comuna",
  zoneNameInputLabel: "Nombre de la Comuna",
  zoneNameRequiredMessage: "Por favor ingresa un nombre válido",
  childrenInputTitle: "Barrios",
  childrenInputDescription: "Ingrese los barrios separadas por coma o presionando (Enter)",
  childrenRequiredMessage: "Por favor ingresa al menos un barrio"
};

const ruralZoneConfigTemplate: Omit<ZoneInputConfig, "currentChildTerms" | "currentZoneName"> = {
  zoneTypeName: "Corregimiento",
  zoneNameInputLabel: "Nombre de el Corregimiento",
  zoneNameRequiredMessage: "Por favor ingresa un nombre válido",
  childrenInputTitle: "Veredes",
  childrenInputDescription: "Ingrese las veredas separadas por coma o presionando (Enter)",
  childrenRequiredMessage: "Por favor ingresa al menos una vereda"
};