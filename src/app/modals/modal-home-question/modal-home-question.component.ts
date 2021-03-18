import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-modal-home-question',
  templateUrl: './modal-home-question.component.html',
  styleUrls: ['./modal-home-question.component.scss']
})
export class ModalHomeQuestionComponent implements OnInit {

  url = environment.url+'/storage';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

}
