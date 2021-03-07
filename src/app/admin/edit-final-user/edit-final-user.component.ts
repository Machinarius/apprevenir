import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { getAllUsers } from '@services/user/usersDataSource';
import { BackendUser } from '@typedefs/backend';
import { LoaderComponent } from 'src/app/core/loader/loader.component';

type UserRow = {
  userId: number;
  firstNames: string;
  lastNames: string;
  email: string,
  statusLabel: string;
}
type UserTableColumnLabels = keyof UserRow | "actions";

@Component({
  selector: 'app-edit-final-user',
  templateUrl: './edit-final-user.component.html',
  styleUrls: ['./edit-final-user.component.scss']
})
export class EditFinalUserComponent implements AfterViewInit {
  public resultsLength = 0;
  public displayedColumns: UserTableColumnLabels[] = [
    'userId', 
    'firstNames', 
    'lastNames', 
    'email', 
    'statusLabel', 
    'actions'
  ];

  public dataSource = new MatTableDataSource<UserRow>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(LoaderComponent) loader: LoaderComponent;

  async ngAfterViewInit() {
    await this.loader.showLoadingIndicator(async () => {
      const users = await getAllUsers();
      this.resultsLength = users.length;
      this.updateUsersTable(users);
    });
  }

  updateUsersTable(users: BackendUser[]) {
    const userRows: UserRow[] = users.map(user => ({
      userId: user.id,
      firstNames: user.profile.first_names,
      lastNames: user.profile.last_names,
      email: user.email,
      statusLabel: user.status == 1 ? "Activo" : "Inactivo"
    }));

    this.dataSource = new MatTableDataSource<UserRow>(userRows);
    this.dataSource.paginator = this.paginator;
  }

  onEditRequested(userId: number) {
    console.log("edit requested: " + userId);
  }
}