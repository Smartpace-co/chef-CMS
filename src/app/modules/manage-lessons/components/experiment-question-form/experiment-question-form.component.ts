import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { of, Subscription } from "rxjs";
import { catchError, first, tap } from "rxjs/operators";
import { ManageNutrientsService } from "src/app/modules/manage-nutrients/services/manage-nutrients.service";
import { FormValidationServices } from "src/app/_metronic/shared/form-validation.service";
import { ManageLessonsService } from "../../services/manage-lessons.service";

const EMPTY_EXPRESSION = {
  question: "",
  hint: "",
  image: "",
  standards: [],
  answers: [],
  answerTypeId: null,
};

@Component({
  selector: "app-experiment-question-form",
  templateUrl: "./experiment-question-form.component.html",
  styleUrls: ["./experiment-question-form.component.scss"],
})
export class ExperimentQuestionFormComponent implements OnInit {
  @Input() fieldControler;
  @Input() lessonId;
  @Input() form;
  @Input() id: number;
  @Input() activeTabId: number;
  @Input() previousStepName;
  @Input() nextStepName;
  @Input() gradeId;
  @Output() changeActiveTab: EventEmitter<number> = new EventEmitter<number>();

  formGroup: FormGroup;
  standardsMaster: any = [];

  dataFromApi: any;
  experimentQues;
  queArray: any = [];
  moreImages: boolean = true;
  isUploadDisabled: boolean;

  answerTypeMaster: any = [];
  answerType: any;
  private subscriptions: Subscription[] = [];
  isLoading$;

  constructor(
    private fb: FormBuilder,
    public validationService: FormValidationServices,
    private lessonService: ManageLessonsService,
    public tableService: ManageNutrientsService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.lessonService.isLoading$;
    this.loadMasters();
    this.getStandardByGrade();
    this.loadExperimentQueData();
  }

  getStandardByGrade() {
    this.lessonService.getStandardByGrade(this.gradeId).subscribe(
      (res: any) => {
        this.standardsMaster = res.data;
      },
      (e) => {
        console.log(e.message);
      }
    );
  }

  loadMasters() {
    this.tableService.loadQuestionAndAnsType().subscribe(
      (res: any) => {
        this.answerTypeMaster = res?.[1].data;
      },
      (e) => {
        console.log(e.message);
      }
    );
  }
  // load experiment questions form with repect to id is available or not
  loadExperimentQueData() {
    if (!this.lessonId) {
      this.experimentQues = EMPTY_EXPRESSION;
      this.loadForm();
    } else {
      const sb = this.lessonService
        .getItemById(this.lessonId)
        .pipe(
          first(),
          catchError((errorMessage) => {
            return of(EMPTY_EXPRESSION);
          })
        )
        .subscribe((experiment: any) => {
          this.dataFromApi = experiment.data;
          this.experimentQues = experiment.data.experiment
            .experimentQuestions[0]
            ? experiment.data.experiment.experimentQuestions[0]
            : EMPTY_EXPRESSION;
          this.experimentQues.standards = this.experimentQues.standards.map(
            (dt) => dt.standard
          );
          this.answerType = this.experimentQues.answerTypeId;
          this.loadForm();
        });
      this.subscriptions.push(sb);
    }
  }

  // save the form data
  onSave() {
    // this.experiments = this.formGroup.value;
    this.prepareForm();
    // console.log("prepare form", this.prepareForm);
    if (this.lessonId) {
      this.edit();
    }
  }

  // update methods
  edit() {
    /* delete this.dataFromApi.recipe;
    delete this.dataFromApi.links;
    delete this.dataFromApi.multiSensoryQuestions;
    delete this.dataFromApi.activity;
    delete this.dataFromApi.questions;
    delete this.dataFromApi.experiment["experimentIngredients"];
    delete this.dataFromApi.experiment["experimentTools"]; */
    
    this.queArray.push(this.experimentQues);
    this.dataFromApi.experiment.experimentQuestions = this.queArray;
    let data={
      id :this.lessonId,
      experiment:{
        id:this.dataFromApi.experiment.id,
        experimentTitle:this.dataFromApi.experiment.experimentTitle,
        experimentQuestions:this.queArray
      }
    }

    const sbUpdate = this.lessonService
      .update(data)
      .pipe(
        tap(() => {
          this.loadExperimentQueData();
          this.changeTab(this.nextStepName);
        }),
        catchError((errorMessage) => {
          return of(this.experimentQues);
        })
      )
      .subscribe((res) => (this.experimentQues = res));
    this.subscriptions.push(sbUpdate);
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      question: [this.experimentQues?.question],
      hint: [this.experimentQues?.hint],
      image: [this.experimentQues?.image],
      questionTrack:[this.experimentQues?.questionTrack],
      standards: [this.experimentQues?.standards, Validators.required],
      answerType: [
        this.experimentQues?.answerTypeId,
        Validators.compose([Validators.required]),
      ],
      answers: this.fb.array([]),
    });

    if (this.experimentQues.answers.length > 0) {
      this.experimentQues.answers.forEach((e) => {
        this.addAnswers(e);
      });
    } else {
      this.addAnswers(undefined);
    }
  }

  private prepareForm() {
    const formData = this.formGroup.value;
    this.experimentQues.question = formData.question;
    this.experimentQues.hint = formData.hint == undefined ? "" : formData.hint;
    this.experimentQues.questionTrack=formData.questionTrack;
    this.experimentQues.image =
    formData.image == undefined ? "" : formData.image;
    if(formData.standards){
      this.experimentQues.standards = formData.standards.map((dt) => dt.id);
    }
    this.experimentQues.answerTypeId = formData.answerType;
    if(formData.answerType=="4"){
      this.experimentQues.answers =[]
    }else{
      this.experimentQues.answers = formData.answers;
    }
  }

  // change tab value
  changeTab(tabId: number) {
    this.activeTabId = tabId;
    this.changeActiveTab.emit(tabId);
    this.prepareForm();
  }

  answers(): FormArray {
    return this.formGroup.get("answers") as FormArray;
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
        isAnswer: [],
      });
    }
    return this.fb.group({
      id: [data.id],
      option: [data.option],
      image: [data.image],
      isAnswer: [data.isAnswer],
    });
  }

  // remove link using a index
  removeQuantity(i: number) {
    this.answers().removeAt(i);
  }

  changeAnswerType(type) {
    this.answerType = type;
    let frmArray = this.formGroup.get("answers") as FormArray;
    frmArray.clear();
    this.addAnswers(undefined);
  }

  singleSelection(event) {
    let frmArray = this.formGroup.get("answers") as FormArray;
    let formControl = frmArray.controls[event.target.id] as FormGroup;
    formControl.controls["isAnswer"].patchValue(event.target.checked);
    console.log(frmArray);
  }

  uploadPairImage(event) {
    this.formGroup.get("hint").disable();
    if (event.target.files && event.target.files.length == 1) {
      const sbCreate = this.tableService
        .imageUpload(event.target.files)
        .pipe()
        .subscribe((res: any) => {
          this.formGroup.patchValue({
            image: res.data[0].mediaPath,
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
    console.log(item);
    if (event.target.files && event.target.files.length == 1) {
      const sbCreate = this.tableService
        .imageUpload(event.target.files)
        .pipe()
        .subscribe((res: any) => {
          item.controls["image"].patchValue(res.data[0].mediaPath);
        });
      this.subscriptions.push(sbCreate);
    }
  }

  uploadTrack(event,fieldName){
    if (event.target.files && event.target.files.length == 1) {
      const sbCreate = this.lessonService.audioUpload(event.target.files).pipe().subscribe((res: any) => {
        this.formGroup.controls[fieldName].patchValue(res.data[0].mediaPath)
      });
      this.subscriptions.push(sbCreate);
    }
  }

  removeTrack(fieldName){
    this.formGroup.controls[fieldName].patchValue('');
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
