import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray  } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user/user.service';
import { CommunesModalComponent } from './communes-modal/communes-modal.component';
import { CorrectionsModalComponent } from './corrections-modal/corrections-modal.component';

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

export class AdminComponent implements OnInit {
  public disabled = false;
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
  colorCtr: AbstractControl = new FormControl(null);
  selectedFiles : any;
  clientForm: FormGroup;
  countries = [];
  states = [];
  cities = [];
  data: Data = {
    users: [
    {name: 'User1', id: 0},
    {name: 'User2', id: 1},
    {name: 'User3', id: 2},
  ]};

  constructor(
    public userService: UserService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.clientForm = this.formBuilder.group({
      client: ['', Validators.required],
      first_names: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      country_id: ['', Validators.required],
      state_id: ['', Validators.required],
      city_id: ['', Validators.required],
      communes: [[]],
      neighborhoods: [[]],
      locations: [[]],
      areas: [[]],
      shifts: [[]],
      schools: [[]]
    }); 

    this.getCountries();
  }

  getCountries() {
    this.userService.countries().subscribe( res => {
        this.countries = res['data'];
      });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  getStates(country) {
    
    if (country != '') {
      this.userService.states(country).subscribe( res => {
         this.states = res['data'];
        });
    } else {
      this.states = [];
      this.getCities('');
    }
  }

  getCities(state) {

    if (state != '') {
      this.userService.cities(state).subscribe( res => {
         this.cities = res['data'];
        });
    } else {
      this.cities = [];
    }
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
    const dialogRef = this.dialog.open(CorrectionsModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogCommunes() {
    const dialogRef = this.dialog.open(CommunesModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
