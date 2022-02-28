import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageLessonsService } from '../../services/manage-lessons.service';
const EMPTY_QUESTION: any = {}
@Component({
  selector: 'app-questions-form',
  templateUrl: './questions-form.component.html',
  styleUrls: ['./questions-form.component.scss']
})
export class QuestionsFormComponent implements OnInit, OnDestroy {
  @Input() lessonId;
  @Input() form;
  @Input() id: number;
  @Input() activeTabId: number;
  @Input() previousStepName;
  @Input() nextStepName;
  @Input() gradeId;
  @Output() changeActiveTab: EventEmitter<number> = new EventEmitter<number>();

  formGroup: FormGroup;
  elaStandards: any = [];
  mathStandards: any = [];
  ngssStandards: any = [];
  ncssStandards: any = [];
  dataFromApi: any;
  subjectQuestion;
  queArray: any = [];
  moreImages: boolean = true;
  isUploadDisabled: boolean;

  answerTypeMaster: any = [];
  questionTypeMaster: any = [];
  estimatedTime = 0;
  answerType: any;
  private subscriptions: Subscription[] = [];
  isLoading$;
  questionData: any = [];
  index: any;

  constructor(private fb: FormBuilder,
    public validationService: FormValidationServices,
    private lessonService: ManageLessonsService,
    public tableService: ManageLessonsService
  ) {
  }

  ngOnInit(): void {
    this.isLoading$ = this.lessonService.isLoading$;
    this.loadMasters();
    this.getStandardByGrade();
    this.loadQuestionData();
  }

  getStandardByGrade() {
    this.lessonService.getStandardBySubject().subscribe(
      (res: any) => {
        this.elaStandards = res[0].data;
        this.mathStandards = res[1].data;
        this.ngssStandards = res[2].data;
        this.ncssStandards = res[3].data;

      },
      (e) => {
        console.log(e.message);
      }
    );

  }

  loadMasters() {
    this.tableService.loadQuestionAndAnsTypeForSubjectQue().subscribe((res: any) => {
      this.questionTypeMaster = res?.[0].data;
      this.answerTypeMaster = res?.[1].data;
    }, (e) => {
      console.log(e.message)
    })
  }

  loadQuestionData() {
    if (!this.lessonId) {
      this.subjectQuestion = EMPTY_QUESTION;
      this.loadForm(undefined);
    } else {
      const sb = this.lessonService.getItemById(this.lessonId).pipe(
        first(),
        catchError((errorMessage) => {
          return of(EMPTY_QUESTION);
        })
      ).subscribe((dt: any) => {
        this.dataFromApi = dt.data;
        this.questionData = dt.data?.questions;
        this.estimatedTime = dt.data?.assessmentTime ? dt.data?.assessmentTime : '25'
        this.loadForm(undefined);
      });
      this.subscriptions.push(sb);
    }
  }
  // load experiment questions form with repect to id is available or not
  loadForm(data) {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      id: [data?.id],
      question: [data?.question],
      questionTypeId: [data?.questionTypeId, Validators.compose([Validators.required])],
      hint: [data?.hint],
      image: [data?.image],
      questionTrack: [data?.questionTrack],
      elaStandard: [data?.elaStandards ? data?.elaStandards : []],
      mathStandard: [data?.mathStandards ? data?.mathStandards : []],
      ngssStandard: [data?.ngssStandards ? data?.ngssStandards: []],
      ncssStandard: [data?.ncssStandards ? data?.ncssStandards: []],
      answerTypeId: [data?.answerTypeId, Validators.compose([Validators.required])],
      answers: this.fb.array([]),
    });
  }

  onSave() {
    if (this.lessonId) {
      this.edit();
    }
  }
  // add Question
  add() {
    if (this.id) {
      const formData = this.formGroup.value;
      !formData.elaStandard? formData.elaStandard = []: null;
      !formData.mathStandard? formData.mathStandard = []: null;
      !formData.ngssStandard? formData.ngssStandard = []: null;
      !formData.ncssStandard? formData.ncssStandard = []: null;
      this.subjectQuestion = {
        id: formData.id,
        question: formData.question,
        questionTypeId: formData.questionTypeId,
        answerTypeId: formData.answerTypeId,
        answer_type: this.getAnswerType(formData.answerTypeId),
        question_type: this.getQuestionType(formData.questionTypeId),
        hint: formData.hint,
        image: formData.image,
        questionTrack: formData.questionTrack,
        //    estimatedTime: formData.estimatedTime,
        answers: formData.answers
      }
      let stds = formData.elaStandard.concat(formData.mathStandard, formData.ngssStandard, formData.ncssStandard);
      this.subjectQuestion.standards = stds.map((dt) => dt);
      this.questionData.forEach((element, i) => {
        if (element.id == this.id) {
          this.questionData[i] = this.subjectQuestion;
          this.formGroup.reset();
          this.id = undefined
        }
      });

    } else {
      const formData = this.formGroup.value;
      !formData.elaStandard? formData.elaStandard = []: null;
      !formData.mathStandard? formData.mathStandard = []: null;
      !formData.ngssStandard? formData.ngssStandard = []: null;
      !formData.ncssStandard? formData.ncssStandard = []: null;
      this.subjectQuestion = {
        question: formData.question,
        questionTypeId: formData.questionTypeId,
        answerTypeId: formData.answerTypeId,
        answer_type: this.getAnswerType(formData.answerTypeId),
        question_type: this.getQuestionType(formData.questionTypeId),
        questionTrack: formData.questionTrack,
        hint: formData.hint,
        image: formData.image,
        answers: formData.answers
      }
        let stds = formData.elaStandard.concat(formData.mathStandard, formData.ngssStandard, formData.ncssStandard);
        this.subjectQuestion.standards = stds.map((dt) => dt);  
      

      this.questionData.push(this.subjectQuestion)
      this.formGroup.reset();
      this.id = undefined
    }

  }

  getQuestionType(questionTypeId: any) {
    return this.questionTypeMaster.find(res => res.id == questionTypeId)
  }

  getAnswerType(answerTypeId: any) {
    return this.answerTypeMaster.find(res => res.id == answerTypeId)
  }
  //edit Question
  loadQuestion(data, i) {
    this.id = data.id;
    this.index = i;
    this.answerType = data?.answerTypeId;
    this.formGroup.controls['id'].patchValue(data.id);
    this.formGroup.controls['question'].patchValue(data.question);
    this.formGroup.controls['questionTrack'].patchValue(data.questionTrack);
    this.formGroup.controls['questionTypeId'].patchValue(data.questionTypeId);
    this.formGroup.controls['answerTypeId'].patchValue(data.answerTypeId);
    if (data.standards) {
      data.elaStandards = (data.standards.filter((dt) => dt.standard.subject.subjectTitle == 'ELA')).map((dt) => dt.standard)
      this.formGroup.controls['elaStandard'].patchValue(data.elaStandards);
      data.mathStandards = (data.standards.filter((dt) => dt.standard.subject.subjectTitle == 'MATH')).map((dt) => dt.standard)
      this.formGroup.controls['mathStandard'].patchValue(data.mathStandards);
      data.ngssStandards = (data.standards.filter((dt) => dt.standard.subject.subjectTitle == 'NGSS')).map((dt) => dt.standard)
      this.formGroup.controls['ngssStandard'].patchValue(data.ngssStandards);
      data.ncssStandards = (data.standards.filter((dt) => dt.standard.subject.subjectTitle == 'NCSS')).map((dt) => dt.standard)
      this.formGroup.controls['ncssStandard'].patchValue(data.ncssStandards);
    }
    //  this.formGroup.controls['estimatedTime'].patchValue(data.estimatedTime);
    this.formGroup.controls['hint'].patchValue(data.hint);
    this.formGroup.controls['image'].patchValue(data.image);
    if (data?.answers.length > 0) {
      data.answers.forEach(e => {
        this.addAnswers(e);
      })
    } else {
      this.addAnswers(undefined)
    }

    // this.formGroup.controls['answers'].patchValue(data.answers);
  }

  // change tab value
  changeTab(tabId: number) {
    this.activeTabId = tabId;
    this.changeActiveTab.emit(tabId);
  }

  answers(): FormArray {
    return this.formGroup.get("answers") as FormArray
  }

  // create a link function pushed the group in link form array
  addAnswers(data) {
    this.answers().push(this.newLinkName(data));
  }

  // form froup of link array methods
  newLinkName(data): FormGroup {
    if (data == undefined) {
      return this.fb.group({
        option: [data],
        image: [data],
        isAnswer: [data]
      })
    }
    return this.fb.group({
      id: [data.id],
      option: [data.option],
      image: [data.image],
      isAnswer: [data.isAnswer]

    })
  }

  // remove link using a index
  removeQuantity(i: number) {
    this.answers().removeAt(i);
  }


  changeAnswerType(type) {
    this.answerType = type;
    let frmArray = this.formGroup.get('answers') as FormArray;
    frmArray.clear();
    this.addAnswers(undefined)
  }

  uploadPairImage(event) {
    this.formGroup.get('hint').disable();
    if (event.target.files && event.target.files.length == 1) {
      const sbCreate = this.tableService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
        this.formGroup.patchValue({
          image: res.data[0].mediaPath
        });
      });
      this.subscriptions.push(sbCreate);
    }
  }


  changeHint(event) {
    if (!event.target.value) {
      this.isUploadDisabled = false;
    } else {
      this.isUploadDisabled = true;
    }
  }

  uploadImage(event, item) {
    console.log(item)
    if (event.target.files && event.target.files.length == 1) {
      const sbCreate = this.tableService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
        item.controls['image'].patchValue(res.data[0].mediaPath)
      });
      this.subscriptions.push(sbCreate);
    }
  }

  delete(index) {
    this.questionData.splice(index, 1)
  }

  // update methods
  edit() {
    this.questionData.forEach(element => {
      if (element.answer_type.title == "Essay type") {
        element.answers = [];
      }
      if (element.standards.length > 0) {
        element.standards = element.standards.map(dt => {
          if (dt.standardId) {
            return dt.standardId
          } else {
            return dt.id
          }
        })
      }
    });
    let data = {
      id: this.lessonId,
      assessmentTime: this.estimatedTime,
      questions: this.questionData
    }
    const sbUpdate = this.lessonService.update(data).pipe(
      tap(() => {
        this.changeTab(this.nextStepName);
      }),
      catchError((errorMessage) => {
        return of(this.subjectQuestion);
      }),
    ).subscribe(res => this.subjectQuestion = res);
    this.subscriptions.push(sbUpdate);
  }

  uploadTrack(event, fieldName) {
    if (event.target.files && event.target.files.length == 1) {
      const sbCreate = this.lessonService.audioUpload(event.target.files).pipe().subscribe((res: any) => {
        this.formGroup.controls[fieldName].patchValue(res.data[0].mediaPath)
      });
      this.subscriptions.push(sbCreate);
    }
  }

  removeTrack(fieldName) {
    this.formGroup.controls[fieldName].patchValue('');
  }

  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
    //this.newIndex = 0;
  }

}
