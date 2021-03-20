import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderComponent } from 'src/app/core/loader/loader.component';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements AfterViewInit {
  public resultsLength = 0;
  public displayedColumns: string[] = [
    'idUser',
    'name',
    'type',
    'test',
    'date'
  ];
  public dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(LoaderComponent) loader: LoaderComponent;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface PeriodicElement {
  idUser: string;
  name: string;
  type: string;
  test: string;
  date: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    idUser: '001',
    name: 'Industrias Noel',
    type: 'Empresa',
    test: 'Activo',
    date: 'icon'
  }
];