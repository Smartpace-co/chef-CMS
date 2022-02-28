import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { ManageNutrientsService } from 'src/app/modules/manage-nutrients/services/manage-nutrients.service';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageLessonsService } from '../../services/manage-lessons.service';
import { Activity } from '../../_models/lessions.model';
const EMPTY_ACTIVITY = {
  activityTitle: '',
  image: '',
  description: '',
  activityQuestions: []

}
@Component({
  selector: 'app-activity-name-form',
  templateUrl: './activity-name-form.component.html',
  styleUrls: ['./activity-name-form.component.scss']
})
export class ActivityNameFormComponent implements OnInit {
  @Input() id: number;
  @Input() activeTabId: number;
  @Input() previousStepName;
  @Input() nextStepName;
  @Input() tabs;
  @Input() lessonId;
  @Output() changeActiveTab: EventEmitter<number> = new EventEmitter<number>();
  activityForm: FormGroup;
  activityData;
  dataFromApi: any;
  moreActivityImage: boolean = true;
  activityImages = [];
  fileSize = 20971520;
  fileWidth = 200;
  fileHeight = 400;
  fileSizeError = false;
  fileResolutionError = false;

  answersArray = [];

  desLevelMaster = [{ name: 'easy', value: 'easy 1st and 2nd grade' },
  { name: 'medium', value: 'medium-3rd and 4th grade' }, { name: 'hard', value: 'hard-5th and 6th grade' }]
  isLoading$;
  private subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    public validationService: FormValidationServices,
    private lessonService: ManageLessonsService,
    public tableService: ManageNutrientsService
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
      this.activityData = EMPTY_ACTIVITY;
      this.loadActivityform();
    } else {
      const sb = this.lessonService.getItemById(this.lessonId).pipe(
        first(),
        catchError((errorMessage) => {
          return of(EMPTY_ACTIVITY);
        })
      ).subscribe((activity: any) => {
        this.dataFromApi = activity.data;
        this.activityData = activity.data?.activity ? activity.data?.activity : EMPTY_ACTIVITY;
        // console.log("loadactivity",this.activityData);
        this.loadActivityform();
      });
      this.subscriptions.push(sb);
    }
  }

  // create a form with respective parameter
  loadActivityform() {
    this.validationService.formGroupDef = this.activityForm = this.fb.group({
      activityName: ['test'],
      image: [this.activityData?.image],
      description: [this.activityData?.description, Validators.required],
      activityQuestions: this.fb.array([])
    })
    // check if question is availabe then filled form or load empty
    if (this.activityData.activityQuestions && this.activityData.activityQuestions.length > 0) {
      this.activityData.activityQuestions.forEach(e => this.addQuestions(e))
    } else {
      this.addQuestions(undefined);
    }
    if (this.activityData.image) {
      this.activityImages = [{image:this.activityData.image}];
      this.moreActivityImage = false;
    }

  }

  // question form load from form group
  activityQuestion(): FormArray {
    return this.activityForm.get('activityQuestions') as FormArray
  }

  // pushed the object in question array
  addQuestions(data) {
    if (this.activityQuestion().controls.length > 3) {
      window.alert('You can Add Maximum 3 Description');
      return;
    } else {
      this.activityQuestion().push(this.newQuestion(data));
    }
  }

  // create a  question form group
  newQuestion(data) {
    if (data == undefined) {
      return this.fb.group({
        question: [data],
        answerTypeId: "4",
        answers: this.fb.array([])
      })
    }
    return this.fb.group({
      id: [data.id],
      question: [data?.question],
      answerTypeId: "4",
      answers: this.fb.array([])
    })
  }

  // remove question form using index
  removeQuestion(i: number) {
    this.activityQuestion().removeAt(i);
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
    // else {
    //   this.create();
    // }
  }

  // create() {
  //   const sbCreate = this.lessonService.create(this.dataFromApi).pipe(
  //     tap(() => {
  //       this.router.navigateByUrl('/manage-lessons/');
  //     }),
  //     catchError((errorMessage) => {

  //       return of(this.activityData);
  //     }),
  //   ).subscribe(res => this.activityData = res);
  //   this.subscriptions.push(sbCreate);
  // }

  // update form
  edit() {
    delete this.activityData.estimatedTime;
    let data = {
      id: this.lessonId,
      activity: this.activityData
    }
    const sbUpdate = this.lessonService.update(data).pipe(
      tap(() => {
        this.changeTab(this.nextStepName);
      }),
      catchError((errorMessage) => {
        return of(this.activityData);
      }),
    ).subscribe(res => this.activityData = res);
    this.subscriptions.push(sbUpdate);
  }

  // prepare data to respective form fields to send api
  prepareForm() {
    const formData = this.activityForm.value;
    this.activityData.activityTitle = 'test';
    this.activityData.image = formData.image;
    this.activityData.description = formData.description;
    this.activityData.activityQuestions = formData.activityQuestions;

  }

  uploadActivityImage(event){
    if (event.target.files && event.target.files.length <= 1) {
      let file = event.target.files;
      for (let i = 0; i < event.target.files.length; i++) {
        if (file[i].size > 20971520)   //max size limit is in bytes. (bytes / 1024).toFixed(2) + " KB";  (bytes / 1048576).toFixed(2) + " MB"
        {
          this.fileSizeError = true
        }

        let reader = new FileReader();
        reader.readAsDataURL(file[i]);
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
            const img_height = rs.currentTarget['height'];
            const img_width = rs.currentTarget['width'];
            if (img_height > this.fileHeight && img_width > this.fileWidth) {
              this.fileResolutionError = true;
            }
          }
          
          this.activityImages.push({image:e.target.result});
          if (this.activityImages?.length == 1) {
            this.moreActivityImage = false;
          
          }
          const sbCreate= this.lessonService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
            let tempArray=[];
            res.data.forEach(element => {
              tempArray.push(element.mediaPath)
            });
            this.activityForm.patchValue({
              image: tempArray[0]
            })
          });
          this.subscriptions.push(sbCreate);
        }
      }
    }
  }

  removeActivityImage(event){
    const index: number = this.activityImages.indexOf(event);
    if (index !== -1) {
    this.activityImages.splice(index,1);
    }    
    this.activityForm.patchValue({
      image: null
    })
    if (this.activityImages?.length == 1) {
      this.moreActivityImage = false;
    }
      else{
        this.moreActivityImage = true
    }
  }


}
