import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { getAllClients } from '@services/user/usersDataSource';
import { ClientTypes, User } from '@typedefs/backend';
import { LoaderComponent } from 'src/app/core/loader/loader.component';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements AfterViewInit {
  public clientColumns: string[] = [
    'id',
    'name',
    'type',
    'status',
    'actions'
  ];

  public clients: User[] = [];
  public clientsDataSource = new MatTableDataSource<UserRowElement>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(LoaderComponent) loader: LoaderComponent;

  async ngAfterViewInit() {
    this.clientsDataSource.paginator = this.paginator;
    await this.loader.showLoadingIndicator(async () => {
      this.clients = await getAllClients();
      this.clientsDataSource.data = this.clients.map(generateRowElement);
    });
  }
}

interface UserRowElement {
  id: number,
  name: string,
  type: string,
  status: string
}

// TODO: Make this a shared/centralized constant
const clientTypeStringsMap: { [key in ClientTypes]: string } = {
  [ClientTypes.Company]: "Empresa",
  [ClientTypes.EducationBureau]: "Secretaría de Educación",
  [ClientTypes.EducationalInstitution]: "Institución Educativa",
  [ClientTypes.NaturalPerson]: "Persona Natural",
  [ClientTypes.TerritorialEntity]: "Entidad Territorial",
  [ClientTypes.University]: "Universidad"
};

function generateRowElement(user: User): UserRowElement {
  return {
    id: user.id,
    name: `${user.profile.first_names} ${user.profile.last_names} ${user.profile.last_names_two}`,
    type: clientTypeStringsMap[user.client],
    status: user.status == 1 ? "Activo" : "Inactivo"
  };
}