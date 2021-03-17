import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { getCities, getCountries, getStates } from '@services/geoData/geoDataSource';
import { City, Country, State } from '@typedefs/backend';
import { LoaderComponent } from 'src/app/core/loader/loader.component';
import { UserService } from 'src/app/services/user/user.service';
import { ZoneEditModalComponent } from './zone-edit-modal/zone-edit-modal.component';
import { NewClientTypes } from './constants/newClientTypes';
import { buildClientFormGroup } from './formSchema';
import { ZoneInputConfig } from './models/ZoneInputConfig';

interface User {
  name: string;
  id: number;
}

interface Data {
  users: User[];
}

export interface CommunesElement {
  comuna: string;
  barrio: string;
  edit: string;
}
export interface CorrectionsElement {
  corregimiento: string;
  vereda: string;
  edit: string;
}

const COMMUNES_ELEMENT_DATA: CommunesElement[] = [
  { comuna: '001', 
    barrio: 'Industrias Noel', 
    edit: 'icon'
  }
];

const CORRECTIONS_ELEMENT_DATA: CorrectionsElement[] = [
  { corregimiento: '001', 
    vereda: 'Industrias Noel', 
    edit: 'icon'
  }
];
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit, AfterViewInit {
  public color: ThemePalette = 'primary';
  public touchUi = false;
  public dataSource = new MatTableDataSource<CommunesElement>(COMMUNES_ELEMENT_DATA);
  public data_Source = new MatTableDataSource<CorrectionsElement>(CORRECTIONS_ELEMENT_DATA);
  public displayedColumns: string[] = [
    'comuna', 
    'barrio', 
    'edit'
  ];
  public displayedColumn: string[] = [
    'corregimiento', 
    'vereda', 
    'edit'
  ];
  clientForm: FormGroup;

  countries: Country[] | null = null;
  states: State[] | null = null;
  cities: City[] | null = null;

  data: Data = {
    users: [
    {name: 'User1', id: 0},
    {name: 'User2', id: 1},
    {name: 'User3', id: 2},
  ]};

  colorCtr: AbstractControl = new FormControl(null);
  selectedFiles : any;

  newClientTypes = NewClientTypes;

  @ViewChild(LoaderComponent) loader: LoaderComponent; 

  constructor(
    public userService: UserService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { }

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

  openDialogCorrection() {
    /*
    const dialogRef = this.dialog.open(CorrectionsModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    */
  }

  async openDialogCommunes() {
    const config: ZoneInputConfig = {
      zoneTypeName: "Comuna",
      zoneNameInputLabel: "Nombre de la Comuna",
      zoneNameRequiredMessage: "Por favor ingresa un nombre válido",
      childrenInputTitle: "Barrios",
      childrenInputDescription: "Ingrese los barrios separadas por coma o presionando (Enter)",
      childrenRequiredMessage: "Por favor ingresa al menos un barrio",
      currentChildTerms: [],
      currentZoneName: ""
    };

    const result = await ZoneEditModalComponent.show(this.dialog, config);
    if (!result.userConfirmed) {
      return;
    }
    
    console.log("User confirmed content", result);
  }
}
