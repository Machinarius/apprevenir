import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { TestDoneModalComponent } from '../test/test-done-modal/test-done-modal.component';
import { TestService } from '../../services/test/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements AfterViewInit {
  
  color = {
    'Severo': '#FF4E60',
    'Moderado': '#FFA14E',
    'Leve': '#20E57E'
  };

  constructor (
    public dialog: MatDialog,
    private testService: TestService
  ) {
    
  }
  public resultsLength = 0;
  public displayedColumns: string[] = [
    'idUser', 
    'id',  
    'test', 
    'date', 
    'time', 
    'user', 
    'city',
    'level',
    'icon',
  ];
  public dataSource = new MatTableDataSource<PeriodicElement>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    
    this.testService.getAllResutls().subscribe(res => {
      this.dataSource = res['data'];
    });
    this.dataSource.paginator = this.paginator;
  }

  openDialogTestModal(test) {
    
    const dialogRef = this.dialog.open(TestDoneModalComponent, {
      data: {test}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  setStyle(color) {
    return {
      'background-color': this.color[color],
      'color': '#fff',
      'padding-left': '15px',
      'padding-right': '15px',
      'border-radius': '10px',
      'padding-top': '1px',
      'padding-bottom': '1px',
    }
  }
}

export interface PeriodicElement {
  idUser: number;
  id: number;
  type: string;
  test: string;
  date: string;
  time: string;
  user: string;
  city: string;
  type_user: string;
  level: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { idUser: 1, 
    id: 2, 
    type: 'Normal', 
    test: 'Tecnologías', 
    date: '08/09/20', 
    time: '10:44:15', 
    user: 'Yunerkis Leal',
    city: 'Medellin',
    type_user: "Consumidor",
    level: 'Moderado'
  }
];