import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { getCities, getCountries, getStates } from '@services/geoData/geoDataSource';
import { City, Country, State, ZoneType } from '@typedefs/backend';
import { LoaderComponent } from 'src/app/core/loader/loader.component';
import { UserService } from 'src/app/services/user/user.service';
import { ZoneEditModalComponent } from './zone-edit-modal/zone-edit-modal.component';
import { NewClientTypes } from './constants/newClientTypes';
import { buildClientFormGroup } from './formSchema';
import { ZoneInputConfig } from './models/ZoneInputConfig';
import { UserZone } from './models/UserZone';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
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
  
  colorCtr: AbstractControl = new FormControl(null);
  selectedFiles : any;

  newClientTypes = NewClientTypes;

  allUrbanZones: UserZone[] = [];
  allRuralZones: UserZone[] = [];

  public urbanZonesDS = new MatTableDataSource<UserZone>(this.allUrbanZones);
  public ruralZonesDS = new MatTableDataSource<UserZone>(this.allRuralZones);

  @ViewChild(LoaderComponent) loader: LoaderComponent; 

  constructor(
    public userService: UserService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { }

  get activeUrbanZones() {
    return this.allUrbanZones.filter(zone => !zone.deletedByUser);
  }

  get activeRuralZones() {
    return this.allRuralZones.filter(zone => !zone.deletedByUser);
  }

  ngOnInit() {
    this.clientForm = buildClientFormGroup(this.formBuilder);
  }

  async ngAfterViewInit() {
    await this.loader.showLoadingIndicator(async () => {
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

  selectFile(event) {
    this.selectedFiles = event.target.files;
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

    this.allRuralZones.push(createdZone);
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

    this.allUrbanZones.push(createdZone);
    this.urbanZonesDS.data = this.activeUrbanZones;
  }

  deleteUrbanZone(currentZone: UserZone) {
    currentZone.deletedByUser = true;
    this.urbanZonesDS.data = this.activeUrbanZones;
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