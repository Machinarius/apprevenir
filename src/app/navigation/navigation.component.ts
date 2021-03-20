import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { EventBus } from '@services/messaging/EventBus';
import { KnownMessageKeys } from '@services/messaging/EventMessage';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import {
  getStoredProfileInfo,
  IProfileInfo,
  ProfileChangedMessage,
} from '../services/auth/authStore';

interface MenuElement {
  name: string;
  children?: MenuElement[];
  icon?: string;
  route?: string;
}
interface MenuNode {
  expandable: boolean;
  name: string;
  level: number;
  icon?: string;
}

const ADMIN_MENU_ELEMENTS: MenuElement[] = [
  {
    name: 'Usuarios finales',
    icon: 'account_box',
    children: [
      {
        name: 'Crear usuario final',
        route: 'admin',
      },
      {
        name: 'Edición de usuario final',
        route: 'admin/edit-final-user',
      },
    ],
  },
  {
    name: 'Informes',
    icon: 'content_paste',
    route: 'admin/report',
  },
  {
    name: 'Usuarios del sistema',
    icon: 'people',
    children: [
      {
        name: 'Crear usuario',
        route: 'admin/system-user',
      },
      {
        name: 'Edición de usuarios',
        route: 'admin/edit-system-user',
      },
    ],
  },
  {
    name: 'Clientes',
    icon: 'perm_identity',
    children: [
      {
        name: 'Crear cliente',
        route: 'admin/create-client',
      },
      {
        name: 'Edición de clientes',
        route: 'admin/clients',
      },
    ],
  },
  {
    name: 'Apprevenir.com',
    icon: 'refresh',
  },
];

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  public userIsAdmin = false;
  public userName = 'Nombre de usuario';

  private _transformer = (node: MenuElement, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      icon: node.icon,
      route: node.route,
    };
  };

  treeControl = new FlatTreeControl<MenuNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: MenuNode) => node.expandable;

  constructor(private authService: AuthService) {
    this.dataSource.data = ADMIN_MENU_ELEMENTS;
    this.updateProfileData = this.updateProfileData.bind(this);
  }

  profileSubscription: Subscription | null;

  ngOnInit(): void {
    this.updateProfileData(getStoredProfileInfo());

    this.profileSubscription = EventBus.instance
      .messages<ProfileChangedMessage>(KnownMessageKeys.ProfileChanged)
      .subscribe((profileMessage) => {
        this.updateProfileData(profileMessage.payload);
      });
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  private updateProfileData(profile: IProfileInfo) {
    this.userIsAdmin = profile.isAdmin;
    this.userName = `${profile.firstNames} ${profile.lastNames}`;
  }

  logout() {
    this.authService.logout();
  }
}
