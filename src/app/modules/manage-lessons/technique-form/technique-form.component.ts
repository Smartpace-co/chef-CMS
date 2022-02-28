import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageCulinaryTechniquesService } from '../../manage-culinary-techniques/service/manage-culinary-techniques.service'
import { ManageLessonsService } from '../services/manage-lessons.service';
const EMPTY_TECH = {
  id: undefined,
  culinaryTechniqueId: null,
}
@Component({
  selector: 'app-technique-form',
  templateUrl: './technique-form.component.html',
  styleUrls: ['./technique-form.component.scss']
})
export class TechniqueFormComponent implements OnInit {
  @Input() fieldControler;
  @Input() lessonId;
  @Input() labelName;
  @Input() form;
  @Input() id: number;
  @Input() activeTabId: number;
  @Input() previousStepName;
  @Input() nextStepName;
  @Output() changeActiveTab: EventEmitter<number> = new EventEmitter<number>();
  formGroup: FormGroup;
  dataFromApi;
  isLoading$;
  private subscriptions: Subscription[] = [];
  techniqueMaster: any = []
  techniqueData: any = [];
  culinaryTechnique: any;
  index: any;
  constructor(
    private fb: FormBuilder,
    public validationService: FormValidationServices,
    private lessonService: ManageLessonsService,
    private techniqueService: ManageCulinaryTechniquesService,

  ) {


  }

  ngOnInit(): void {
    this.clearFormArray();
    this.lessonService.getTechniqueMaster().subscribe(
      (res:any) => {
        this.techniqueMaster=res[0].data.filter((s) => s.status === true);
      });
    this.isLoading$ = this.lessonService.isLoading$;
    if (this.form && this.fieldControler) {
      this.loadFormData();

    }
  }

  // 

  clearFormArray() {
    let frmArray = this.form.get(`${this.fieldControler}`) as FormArray;
    frmArray.clear();
  }

  loadFormData() {
    if (!this.lessonId) {
      this.techniqueData = EMPTY_TECH;
      this.loadForm(undefined)
    } else {
      const sb = this.lessonService.getItemById(this.lessonId).pipe(
        first(),
        catchError((errorMessage) => {
          return of(EMPTY_TECH);
        })
      ).subscribe((dt: any) => {
        this.dataFromApi = dt.data;
        this.techniqueData = dt.data.recipe[`${this.fieldControler}`];
        this.loadForm(undefined)
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm(data) {
    this.culinaryTechnique = data;
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      id: [data?.id],
      culinaryTechniqueId: [data?.culinaryTechniqueId],
      estimatedTime: [data?.estimatedTime],
    });
  }

  // add ingredient
  add() {
    if (this.id) {
      const formData = this.formGroup.value;
      this.culinaryTechnique = {
        culinaryTechniqueId: formData.culinaryTechniqueId,
        culinaryTechnique: this.techniqueMaster.find((dt) => {
          if (formData.culinaryTechniqueId == dt.id) return dt
        }),
        estimatedTime: formData.estimatedTime
      }
      this.techniqueData.forEach((element, i) => {
        if (element.id == this.id) {
          this.techniqueData[i] = this.culinaryTechnique;
          this.formGroup.reset();
          this.id=undefined
        }
      });

    } else {
      const formData = this.formGroup.value;
      this.culinaryTechnique = {
        culinaryTechniqueId: formData.culinaryTechniqueId,
        culinaryTechnique: this.techniqueMaster.find((dt) => {
          if (formData.culinaryTechniqueId == dt.id) return dt
        }),
        estimatedTime: formData.estimatedTime
      }

      this.techniqueData.push(this.culinaryTechnique)
      this.formGroup.reset();
      this.id=undefined
    }
  }

  //edit ingredient
  loadTechnique(event,i) {
    this.id = event.id;
    this.index=i;
    this.loadForm(event);
  }

  //  delete ingredient

  delete(index) {
    this.techniqueData.splice(index, 1)
  }

  onSave() {
    if (this.lessonId) {
      this.techniqueData.forEach(element => {
        element.culinaryTechniqueId = element.culinaryTechniqueId
      });
      this.edit();
    }
  }

  edit() {
  //  this.dataFromApi.recipe['bigChefTools'] = this.dataFromApi.recipe['bigChefTools'].map(dt => dt.toolId)
 //   this.dataFromApi.recipe['littleChefTools'] = this.dataFromApi.recipe['littleChefTools'].map(dt => dt.toolId)
    this.dataFromApi.recipe[`${this.fieldControler}`] = this.techniqueData;
    let data = {
      id: this.lessonId,
      recipe: {
        id:this.dataFromApi?.recipe.id,
        recipeTitle:this.dataFromApi?.recipe.recipeTitle,
        recipeTechniques:this.techniqueData
      },
    };
    const sbUpdate = this.lessonService.update(data).pipe(
      tap(() => {
        this.clearFormArray();
        this.loadFormData();
        this.changeTab(this.nextStepName);
      }),
      catchError((errorMessage) => {
        return of(this.techniqueData);
      }),
    ).subscribe(res => this.techniqueData = res);
    this.subscriptions.push(sbUpdate);
  }


  changeTab(tabId: number) {
    this.activeTabId = tabId;
    this.changeActiveTab.emit(tabId);
  }


  /*  uploadPairImage(i,event){
     this.form.controls[`${this.fieldControler}`].controls[i].get('link').disable();
 
      if (event.target.files && event.target.files.length == 1) {
       let reader = new FileReader();
       reader.readAsDataURL(event.target.files[0]);
       reader.onload = (e: any) => {
         const image = new Image();
         image.src = e.target.result;
         this.matchImages.push({image:e.target.result});
 
       const sbCreate= this.lessonService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
         this.form.controls[`${this.fieldControler}`].controls[i].controls['image'].patchValue(res.data[0].mediaPath)
       });
       this.subscriptions.push(sbCreate);
     }
   }
  
   } */

  ngOnDestroy() {
    this.form.reset();
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
