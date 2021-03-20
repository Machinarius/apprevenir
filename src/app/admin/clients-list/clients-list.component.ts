import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { deleteUser, getAllClients } from '@services/user/usersDataSource';
import { ClientTypes, User } from '@typedefs/backend';
import { LoaderComponent } from 'src/app/core/loader/loader.component';
import Swal from "sweetalert2";

@Component({
  selector: 'clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements AfterViewInit {
  public clientColumns: string[] = [
    'id',
    'name',
    'type',
    'status',
    'actions'
  ];

  public clients: User[] = [];
  public clientsDataSource = new MatTableDataSource<ClientRowElement>([]);
  public clientsFilter: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(LoaderComponent) loader: LoaderComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.clientsDataSource.filterPredicate = this.filterClients;
  }

  async ngAfterViewInit() {
    this.clientsDataSource.paginator = this.paginator;
    await this.reloadClients();
  }

  async reloadClients() {
    await this.loader.showLoadingIndicator(async () => {
      this.clients = await getAllClients();
      this.clientsDataSource.data = this.clients.map(generateRowElement);
    });
  }

  onClientEditRequested(client: ClientRowElement) {
    this.router.navigate([client.id], { relativeTo: this.activatedRoute });
  }

  async onClientRemovalRequested(client: ClientRowElement) {
    const reply = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿De verdad quieres eliminar el cliente '${client.name}'?`,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      confirmButtonColor: "f44336",
      icon: "warning"
    });
    
    if (!reply.isConfirmed) {
      return;
    }

    try {
      await this.loader.showLoadingIndicator(async () => {
        await deleteUser(client.id);
      });
    } catch (error) {
      await Swal.fire("Error", 
        "No fue posible contactar el servidor, por favor verifica tu conexión a internet e inténtalo de nuevo", 
        "error"
      );
      return;
    }

    await Swal.fire("Éxito", "El cliente ha sido eliminado exitosamente", "info");
    await this.reloadClients();
  }

  onClientsFilterChanged() {
    this.clientsDataSource.filter = this.clientsFilter;
  }

  filterClients(client: ClientRowElement, filter: string) {
    return client.name.toLowerCase().includes(filter.toLowerCase());
  }
}

interface ClientRowElement {
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

function generateRowElement(user: User): ClientRowElement {
  return {
    id: user.id,
    name: generateName(user),
    type: clientTypeStringsMap[user.client],
    status: user.status == 1 ? "Activo" : "Inactivo"
  };
}

function generateName(user: User) {
  const nameFragments = [
    user.profile.first_names,
    user.profile.last_names,
    user.profile.last_names_two
  ].filter(
    name => name != null && name != "null"
  );

  return nameFragments.join(" ");
}