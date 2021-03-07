import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-leve-modal',
  templateUrl: './leve-modal.component.html',
  styleUrls: ['./leve-modal.component.scss']
})
export class LeveModalComponent implements OnInit {

  level: any;
  gifLevel: any;
  colorsLevel: any;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {

    this.level = this.data.level;
    this.gifLevel = this.data.gifLevel;
    this.colorsLevel = this.data.colorsLevel;
  }

}
