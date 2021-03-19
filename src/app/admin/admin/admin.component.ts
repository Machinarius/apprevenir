import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { getCities, getCountries, getStates } from '@services/geoData/geoDataSource';
import { City, Country, State, Test, ZoneType } from '@typedefs/backend';
import { LoaderComponent } from 'src/app/core/loader/loader.component';
import { UserService } from 'src/app/services/user/user.service';
import { ZoneEditModalComponent } from './zone-edit-modal/zone-edit-modal.component';
import { NewClientTypes } from './constants/newClientTypes';
import { buildClientFormGroup, configureTestsControl, storeBrandImageFiles } from './formSchema';
import { ZoneInputConfig } from './models/ZoneInputConfig';
import { UserZone } from './models/UserZone';
import { ClientTypes } from "@typedefs/backend/userData/ClientTypes";
import { ChipInputComponent } from './chip-autocomplete/chip-input.component';
import { getAllTests } from '@services/test/testsDataSource';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements AfterViewInit {
  public color: ThemePalette = 'primary';
  public touchUi = false;

  public zoneTableColumns: string[] = [
    'name', 
    'children', 
    'actions'
  ];
  
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
    private userService: UserService,
    private dialog: MatDialog,
    formBuilder: FormBuilder
  ) {
    this.clientForm = buildClientFormGroup(formBuilder, false);
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
    this.clientForm.get("ruralZone").setValue(zones);
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
      //await this.loadProfileFormDataIfNeeded();
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

  onSubmit() {

    if(this.clientForm.invalid) {
      return;
    }

    let formData = Object.assign(this.clientForm.value);

    formData.last_names = 'cliente';

    this.userService.client(formData);
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
    this.ruralZonesDS.data = this.activeUrbanZones;
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

  onSubmitClicked() {
    this.runValidationsOnChipInputs();
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
  zoneNameInputLabel: "Nombre de la Vereda",
  zoneNameRequiredMessage: "Por favor ingresa un nombre válido",
  childrenInputTitle: "Veredes",
  childrenInputDescription: "Ingrese las veredas separadas por coma o presionando (Enter)",
  childrenRequiredMessage: "Por favor ingresa al menos una vereda"
};