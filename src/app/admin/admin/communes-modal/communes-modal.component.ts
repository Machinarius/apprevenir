import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PillOption } from '../chip-autocomplete/chip-autocomplete.component';

@Component({
  selector: 'app-communes-modal',
  templateUrl: './communes-modal.component.html',
  styleUrls: ['./communes-modal.component.scss']
})
export class CommunesModalComponent implements OnInit {
  possibleAreas: PillOption[] = [{
    key: "1",
    label: "Producción"
  }, {
    key: "2",
    label: "Investigación"
  }];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

}
