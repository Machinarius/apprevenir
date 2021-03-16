import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PillOption } from '../chip-autocomplete/chip-autocomplete.component';
@Component({
  selector: 'app-corrections-modal',
  templateUrl: './corrections-modal.component.html',
  styleUrls: ['./corrections-modal.component.scss']
})
export class CorrectionsModalComponent implements OnInit {
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
