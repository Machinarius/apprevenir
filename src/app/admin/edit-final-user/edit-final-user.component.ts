import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule,FormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-edit-final-user',
  templateUrl: './edit-final-user.component.html',
  styleUrls: ['./edit-final-user.component.scss']
})
export class EditFinalUserComponent implements AfterViewInit {
  
  public resultsLength = 0;
  public displayedColumns: string[] = [
    'idUser', 
    'name', 
    'lastNames', 
    'email', 
    'test', 
    'date'
  ];
  public dataSource = new MatTableDataSource<PeriodicElement>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor (
    private userService: UserService
  ) {}

  ngAfterViewInit() {
    this.userService.getUsers().subscribe(res => {
      this.dataSource = res['data'];
    });
    
    this.dataSource.paginator = this.paginator;
  }
}

export interface PeriodicElement {
  idUser: string;
  name: string;
  lastNames: string;
  email: string,
  test: string;
  date: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { idUser: '001', 
    name: 'Industrias Noel', 
    lastNames: 'Industrias Noel 2',
    email: 'test@test.com',
    test: 'Activo', 
    date: 'icon'
  }
];