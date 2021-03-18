import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalHomeQuestionComponent } from '../modals/modal-home-question/modal-home-question.component';
import { HomeModalComponent } from './home-modal/home-modal.component';
import { TestService } from '../services/test/test.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  tests = [];
  arryTests = [];
  url = this.testService.url+'/storage';
  SearchForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private testService: TestService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {

    this.SearchForm = this.formBuilder.group({
      search: [''],
    }); 

    this.testService.getTestsList().subscribe( res => {
      this.tests = res['data']; 
      this.arryTests = res['data'];
    });
  }

  arrayFilter() {

    let search = this.SearchForm.value.search.toLowerCase();
    this.tests = this.arryTests;
    this.tests = this.tests.filter(function(test) {
      if (test.name.toLowerCase().indexOf(search) !== -1) {
        return test;
      }
    });
  }

  openDialog(test) {
    const dialogRef = this.dialog.open(ModalHomeQuestionComponent, {
      data: {
        test: test
      },
      id: "modal-home-padding"

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogHome(test) {
    const dialogRef = this.dialog.open(HomeModalComponent, {
      id: "modal-drugs-width",
      data: test
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
