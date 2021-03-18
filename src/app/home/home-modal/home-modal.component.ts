import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule,FormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-modal',
  templateUrl: './home-modal.component.html',
  styleUrls: ['./home-modal.component.scss']
})
export class HomeModalComponent implements OnInit {

  url = environment.url+'/storage';
  addiction: FormGroup;

  @ViewChild('close') close: ElementRef<HTMLElement>;
  
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    

  ) { }

  ngOnInit(): void {

    this.addiction = this._formBuilder.group({
      addiction_id: ['', Validators.required],
    });
  }

  onSubmit(id) {
    if(!this.addiction.invalid) {
      let el: HTMLElement = this.close.nativeElement;
      el.click();
      let addiction = this.addiction.value.addiction_id
      let res = addiction.split(" ");
      this.router.navigate(['/test/'+id], { queryParams: { addiction_id: res[0], addiction :res[1]  } });
    }
  }
}
