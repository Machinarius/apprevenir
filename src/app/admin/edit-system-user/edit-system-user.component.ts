import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from 'src/app/core/loader/loader.component';
import { getAllUsers } from '@services/user/usersDataSource';
import { User } from '@typedefs/backend';
import { getStoredProfileInfo } from "@services/auth/authStore";

type UserRow = {
  userId: number;
  firstNames: string;
  lastNames: string;
  email: string,
  statusLabel: string;
}
type UserTableColumnLabels = keyof UserRow | "actions";

@Component({
  selector: 'app-edit-system-user',
  templateUrl: './edit-system-user.component.html',
  styleUrls: ['./edit-system-user.component.scss']
})
export class EditSystemUserComponent implements  AfterViewInit {
  
  userId = 0;
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

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) { }

  async ngAfterViewInit() {
    await this.loader.showLoadingIndicator(async () => {
      const users = await getAllUsers(true);
      this.resultsLength = users.length;
      this.updateUsersTable(users);
      const currentProfile = getStoredProfileInfo();
      this.userId = currentProfile.id;
    });
  }

  updateUsersTable(users: User[]) {
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
    this._router.navigate([userId], { relativeTo: this._activatedRoute });
  }
}