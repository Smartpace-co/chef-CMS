import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageLessonsService } from '../../services/manage-lessons.service';
import { Activity } from '../../_models/lessions.model';
const EMPTY_QUESTION = {
  question: "",
  answerTypeId: 2,
  estimatedMakeTime: "",
  answers: [],

}
@Component({
  selector: 'app-sensory-question-form',
  templateUrl: './sensory-question-form.component.html',
  styleUrls: ['./sensory-question-form.component.scss']
})
export class SensoryQuestionFormComponent implements OnInit {

  @Input() id: number;
  @Input() activeTabId: number;
  @Input() previousStepName;
  @Input() nextStepName;
  @Input() tabs;
  @Input() lessonId;
  @Output() changeActiveTab: EventEmitter<number> = new EventEmitter<number>();
  multiSensoryForm: FormGroup;
  questionData;
  dataFromApi: any;
  moreSensoryImage: boolean = true;
  sensoryImages = [];
  fileSize = 20971520;
  fileWidth = 200;
  fileHeight = 400;
  fileSizeError = false;
  fileResolutionError = false;

  answersArray = [];

  isLoading$;
  private subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    public validationService: FormValidationServices,
    private lessonService: ManageLessonsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.lessonService.isLoading$;
    if (this.lessonId) {
      this.loadActivity();
    }
  }

  // check weather id is available if available then call get api and field form otherwise show empty field form

  loadActivity() {
    if (!this.lessonId) {
      this.questionData = EMPTY_QUESTION;
      this.loadmultiSensoryForm();
    } else {
      const sb = this.lessonService.getItemById(this.lessonId).pipe(
        first(),
        catchError((errorMessage) => {
          return of(EMPTY_QUESTION);
        })
      ).subscribe((res: any) => {
        this.dataFromApi = res.data;
        this.questionData = res.data?.multiSensoryQuestions.length>0 ? res.data?.multiSensoryQuestions[0] : EMPTY_QUESTION;
        // console.log("loadactivity",this.questionData);
        this.loadmultiSensoryForm();
      });
      this.subscriptions.push(sb);
    }
  }

  // create a form with respective parameter
  loadmultiSensoryForm() {
    this.validationService.formGroupDef = this.multiSensoryForm = this.fb.group({
      estimatedMakeTime: [this.questionData?.estimatedTime],
      question:[this.questionData.question]
    })
  }
  
 
  // tab change feature
  changeTab(tabId: number) {
    this.activeTabId = tabId;
    this.changeActiveTab.emit(tabId);
  }

  // save form data
  onSave() {
    this.prepareForm();
    if (this.lessonId) {
      this.edit();
    }
  }

  // update form
  edit() {
    let data = {
      id: this.lessonId,
      multiSensoryQuestions: [this.questionData]
    }
    const sbUpdate = this.lessonService.update(data).pipe(
      tap(() => {
        this.changeTab(this.nextStepName);
        //this.router.navigateByUrl('/manage-lessons/');
      }),
      catchError((errorMessage) => {
        return of(this.questionData);
      }),
    ).subscribe(res => this.questionData = res);
    this.subscriptions.push(sbUpdate);
  }

  // prepare data to respective form fields to send api
  prepareForm() {
    const formData = this.multiSensoryForm.value;
    this.questionData.answerTypeId="2";
    this.questionData.estimatedTime=formData.estimatedMakeTime;
    this.questionData.question=formData.question;
    this.questionData.answers=[];
  }

  

}
