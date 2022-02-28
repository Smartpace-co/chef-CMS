import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageLessonsService } from '../services/manage-lessons.service';
const EMPTY_SHAREDATA = {
  test: '',
  link: '',
  estimatesTime: 0,
  toolsBigChef: [],
  toolslittleChef: [],
  desciption: []
}
@Component({
  selector: 'app-shared-form',
  templateUrl: './shared-form.component.html',
  styleUrls: ['./shared-form.component.scss']
})
export class SharedFormComponent implements OnInit, OnDestroy {
  @Input() form;
  @Input() fieldControler;
  @Input() labelName;
  @Input() activeTabId: number;
  @Input() previousStepName;
  @Input() nextStepName;
  @Input() lessonId;
  @Input() trackField;
  @Input() timeField;
  @Output() changeActiveTab: EventEmitter<number> = new EventEmitter<number>();
  formGroup: FormGroup;
  trackForm: FormGroup;
  toolBigChefMaster: any = [{ "id": "1", "name": "Big Chef" }, { "id": "2", "name": "Little Chef" }];
  dataFromApi;
  isLoading$;
  private subscriptions: Subscription[] = [];
  matchImages: any = [];
  controlerData;
  isUploadDisabled: boolean;
  constructor(
    private fb: FormBuilder,
    public validationService: FormValidationServices,
    private lessonService: ManageLessonsService,
  ) {

  }

  ngOnInit(): void {
    this.clearFormArray();
    this.isLoading$ = this.lessonService.isLoading$;
    if (this.form && this.fieldControler) {
      if (this.lessonId) {
        this.loadSharedFormData();
      }
    }
  }

  // 

  clearFormArray() {
    let frmArray = this.form.get(`${this.fieldControler}`) as FormArray;
    frmArray.clear();
  }

  loadSharedFormData() {
    if (!this.lessonId) {
      this.controlerData = EMPTY_SHAREDATA;
      this.addQuantity(undefined);
      this.loadTrackForm();
    } else {
      const sb = this.lessonService.getItemById(this.lessonId).pipe(
        first(),
        catchError((errorMessage) => {
          return of(EMPTY_SHAREDATA);
        })
      ).subscribe((dt: any) => {
        this.dataFromApi = dt.data;
        this.loadTrackForm();
        if(this.fieldControler!=='cleanupSteps'){
          this.controlerData = dt.data.recipe[this.fieldControler] ? dt.data.recipe[this.fieldControler] : EMPTY_SHAREDATA;
        }
        else{
          this.controlerData = dt.data[this.fieldControler] ? dt.data[this.fieldControler] : EMPTY_SHAREDATA;
        }
        if (this.controlerData && this.controlerData.length > 0) {
          this.controlerData.forEach(e => this.addQuantity(e));
        } else {
          this.addQuantity(undefined);
        }
      });
      this.subscriptions.push(sb);
    }
  }

  loadTrackForm() {
    if(this.fieldControler!=='cleanupSteps'){
      this.trackForm=this.fb.group({
        track: [this.dataFromApi.recipe[this.trackField], Validators.compose([Validators.required])],
        time: [this.dataFromApi.recipe[this.timeField]],

      })
    }else{
      this.trackForm=this.fb.group({
        track: [this.dataFromApi[this.trackField], Validators.compose([Validators.required])],
      })
    }  
  }

  onSave() {
    if (this.lessonId) {
      this.edit();
    }
  }

  edit() {
    // this.dataFromApi.recipe['bigChefTools']=this.dataFromApi.recipe['bigChefTools'].map(dt => dt.toolId)
    //  this.dataFromApi.recipe['littleChefTools']=this.dataFromApi.recipe['littleChefTools'].map(dt => dt.toolId)
    //  this.dataFromApi.recipe[`${this.fieldControler}`] = this.form.get(`${this.fieldControler}`).value;
    let data = {
      id: this.lessonId,
      recipe: {
        id: this.dataFromApi?.recipe.id,
        recipeTitle: this.dataFromApi?.recipe.recipeTitle,
        [`${this.fieldControler}`]: this.form.get(`${this.fieldControler}`).value,
        [`${this.trackField}`]: this.trackForm.get('track').value,
        [`${this.timeField}`]: this.trackForm.get('time')?.value?this.trackForm.get('time').value:undefined,
      },
    };

    if (this.fieldControler === 'cleanupSteps') {
      data = {
        id: this.lessonId,
        recipe: null,
        [`${this.fieldControler}`]: this.form.get(`${this.fieldControler}`).value,
        [`${this.trackField}`]: this.trackForm.get('track').value
      }
    }

    const sbUpdate = this.lessonService.update(data).pipe(
      tap(() => {
        this.clearFormArray();
        this.loadSharedFormData();
        this.changeTab(this.nextStepName);
      }),
      catchError((errorMessage) => {
        return of(this.controlerData);
      }),
    ).subscribe(res => this.controlerData = res);
    this.subscriptions.push(sbUpdate);
  }


  changeTab(tabId: number) {
    this.activeTabId = tabId;
    this.changeActiveTab.emit(tabId);
  }

  formArrayControls(): FormArray {
    return this.form.get(`${this.fieldControler}`) as FormArray
  }

  addQuantity(data) {
    this.formArrayControls().push(this.newFormName(data));
  }

  newFormName(data): FormGroup {
    this.matchImages.push({ image: data?.image })
    if(data==undefined){
      if(this.fieldControler === 'cookingSteps' ||this.fieldControler === 'preparationSteps'){
        return this.fb.group({
          text: [data?.text, Validators.required],
          link: [data?.link],
          image: [data?.image],
          estimatedTime: [30],
          isApplicableForBigChef: [data?.isApplicableForBigChef],
          isApplicableForLittleChef: [data?.isApplicableForLittleChef]
        });
      }
      
    }
    
    return this.fb.group({
      text: [data?.text, Validators.required],
      link: [data?.link],
      image: [data?.image],
      estimatedTime: [data?.estimatedTime],
      isApplicableForBigChef: [data?.isApplicableForBigChef],
      isApplicableForLittleChef: [data?.isApplicableForLittleChef]
    });
  }


  removeQuantity(i: number) {
    this.formArrayControls().removeAt(i);
  }

  changeHint(event) {
    if (!event.target.value != undefined) {
      this.isUploadDisabled = true;
    }
  }

  uploadPairImage(i, event) {
    this.form.controls[`${this.fieldControler}`].controls[i].get('link').disable();
    if (event.target.files && event.target.files.length == 1) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        this.matchImages.push({ image: e.target.result });
        const sbCreate = this.lessonService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
          this.form.controls[`${this.fieldControler}`].controls[i].controls['image'].patchValue(res.data[0].mediaPath)
        });
        this.subscriptions.push(sbCreate);
      }
    }
  }

  uploadTrack(event) {
    if (event.target.files && event.target.files.length == 1) {
      const sbCreate = this.lessonService.audioUpload(event.target.files).pipe().subscribe((res: any) => {
        this.trackForm.controls['track'].patchValue(res.data[0].mediaPath)
      });
      this.subscriptions.push(sbCreate);
    }
  }

  removeTrack(){
    this.trackForm.controls['track'].patchValue('')
  }

  ngOnDestroy() {
    this.form.reset();
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
