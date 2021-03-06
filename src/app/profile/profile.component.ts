import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { getStoredProfileInfo, IProfileInfo, ProfileChangedMessage } from '@services/auth/authStore';
import { EventBus } from '@services/messaging/EventBus';
import { KnownMessageKeys } from '@services/messaging/EventMessage';
import { Subscription } from 'rxjs';
import { TestService } from '../services/test/test.service';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: "Tecnologías", name: '08/09/20', weight: "MODERADO", symbol: '--'},
];
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  firstNames = "Nombres";
  lastNames = "Apellidos";
  
  color = {
    'Severo': '#FF4E60',
    'Moderado': '#FFA14E',
    'Leve': '#20E57E'
  };

  displayedColumns: string[] = ['Test', 'Fecha', 'Nivel', 'Respuestas'];
  dataSource = [];
  
  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private testService: TestService
  ) { }

  profileSubscription: Subscription | null;

  ngOnInit(): void {
    this.testService.myResults().subscribe(res => {
      this.dataSource = res['data']
    });

    this.updateProfileData(getStoredProfileInfo());
    this.profileSubscription = EventBus.instance.messages<ProfileChangedMessage>(
      KnownMessageKeys.ProfileChanged
    ).subscribe((profileMessage) => {
      this.updateProfileData(profileMessage.payload);
    });
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  private updateProfileData(profile: IProfileInfo) {
    this.firstNames = profile.firstNames;
    this.lastNames = profile.lastNames;
  }
  
  openDialogProfile(test) {
    const dialogRef = this.dialog.open(ProfileModalComponent, {
      id: "modal-width",
      data: test
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