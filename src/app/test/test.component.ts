import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { TestService } from '../services/test/test.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray  } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InformationModalComponent } from './information-modal/information-modal.component';
import { ConfidentialModalComponent } from './confidential-modal/confidential-modal.component';
import { LeveModalComponent } from './leve-modal/leve-modal.component';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  addiction = null;
  url = this.testService.url;
  test = {};
  formGroup: FormGroup;
  answers = [];
  answer = {};
  questions: any;
  result = false;
  resultLevel = "";
  url_video = "";
  professional_help = "";
  url_interest = "";
  order = {
    0:"a",
    1:"b",
    2:"c",
    3:"d",
    4:"e",
    5:"f",
    6:"g",
    7:"h",
    8:"i",
    9:"j",
    10:"k",
    11:"l",
    12:"m",
  };
  gifLevel = {
    'Leve': '<img src="../../../assets/images/leve.gif" alt="leve" width="290px">',
    'Ausencia de Ansiedad': '<img src="../../../assets/images/leve.gif" alt="leve" width="290px">',
    'Ausencia de depresión': '<img src="../../../assets/images/leve.gif" alt="leve" width="290px">',
    'Moderado': '<img src="../../../assets/images/moderado.gif" alt="moderado" width="290px">',
    'Severo': '<img src="../../../assets/images/severo.gif" alt="severo" width="290px">',
    'Presencia de Ansiedad': '<img src="../../../assets/images/severo.gif" alt="severo" width="290px">',
    'Presencia de depresión': '<img src="../../../assets/images/severo.gif" alt="severo" width="290px">',
  };
  colorsLevel = {
    'Leve': 'color: #20E57E',
    'Ausencia de Ansiedad': 'color: #20E57E',
    'Ausencia de depresión': 'color: #20E57E',
    'Moderado': 'color: #FFA14E',
    'Severo': 'color: #FF4E60',
    'Presencia de Ansiedad': 'color: #FF4E60',
    'Presencia de depresión': 'color: #FF4E60',
  };

  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(
    private route: ActivatedRoute,
    public testService: TestService,
    private formBuilder: FormBuilder,
    private _sanitizer: DomSanitizer,
    public dialog: MatDialog,
  ) { }

  openDialogInformation(test) {
    const dialogRef = this.dialog.open(InformationModalComponent, {
      data: {
        test: test
      },
      id: "modal-home-padding"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogConfidential() {
    const dialogRef = this.dialog.open(ConfidentialModalComponent, {
      id: "modal-confidencial-width"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogSuppor(test) {
    const dialogRef = this.dialog.open(LeveModalComponent, {
      data: {
        test: test
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({formArray: this.formBuilder.array([])});

    const id = this.route.snapshot.paramMap.get("id");

    this.addiction = this.route.snapshot.queryParamMap.get("addiction");

    this.testService.getTest(id).subscribe(res => {

      this.test = res['data'];
      this.questions =  this.test['questions'];
      this.test['questions'].forEach((question, i) => {
        this.answer = {};
        this.answer['answer_'+i] = ['', Validators.required];
        this.answers.push(this.formBuilder.group(this.answer));
      });
      this.formGroup = this.formBuilder.group({ formArray: this.formBuilder.array(this.answers) });
      this.openDialogConfidential();
    });
  }

  onSubmit() {

    let arrayAnswers =  this.formGroup.value.formArray;
    let key = 'answer_';
    let objAnswers = [];
    arrayAnswers.forEach((e, i) => {
      objAnswers.push(e[key+i]);
    });

    let result = {
      'test_id': this.test['id'],
      'answers':objAnswers,
      'addiction_id': this.route.snapshot.queryParamMap.get("addiction_id")
    }

    this.testService.storeAnswer(result).subscribe( res => {
      this.result = true;
      this.resultLevel = res['data']['resultLevel'];
      this.url_video = res['data']['url_video'];
      this.professional_help = res['data']['professional_help'];
      this.url_interest = res['data']['url_interest'];
    });
  }

  getVideoIframe(url) {
    var video, results;

    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];

    return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);   
}

}
