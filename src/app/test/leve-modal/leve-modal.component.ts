import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-leve-modal',
  templateUrl: './leve-modal.component.html',
  styleUrls: ['./leve-modal.component.scss']
})
export class LeveModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
  }

}
