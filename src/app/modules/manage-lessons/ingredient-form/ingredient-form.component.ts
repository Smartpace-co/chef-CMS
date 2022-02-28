import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageLessonsService } from '../services/manage-lessons.service';
import { ManageUnitOfMeasureService } from "src/app/modules/manage-units-of-measurement/service/unitOfMesurement.service";
import { ManageIngredientsService } from "src/app/modules/manage-ingredients/services/manage-ingredients.service";

const EMPTY_INGREDIENTDATA = {
  ingredient: null,
  unitOfMeasurementId: null,
  quantity: 0,
  linkOfImage: '',
  isOptional:false,
  isSpotlight:false,
}
@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.scss']
})
export class IngredientFormComponent implements OnInit {
  @Input() fieldControler;
  @Input() labelName;
  @Input() lessonId;
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
  unitOfMeasureMaster: any = [];
  ingredientMaster: any = []
  ingredientData: any = [];
  isUploadDisabled: boolean;
  ingredient: any;
  index: any;
  constructor(
    private fb: FormBuilder,
    public validationService: FormValidationServices,
    private lessonService: ManageLessonsService,
    private ingredientsService: ManageIngredientsService,
    private unitOfMesureService: ManageUnitOfMeasureService,

  ) {
    /* this.ingredientsService.fetch();
    this.ingredientsService.items$.subscribe(
      (res) => (this.ingredientMaster = res.filter((s) => s.status === true))
    ); */

   /*  this.unitOfMesureService.fetch();
    this.unitOfMesureService.items$.subscribe(
      (res) => (this.unitOfMeasureMaster = res.filter((s) => s.status === true))
    ); */
  }

  ngOnInit(): void {
    this.clearFormArray();
    this.lessonService.getIngredientMaster().subscribe(
      (res:any) => {
        this.unitOfMeasureMaster=res[0].data.filter((s) => s.status === true);
        this.ingredientMaster = res[1].data.filter((s) => s.status === true);
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
      this.ingredientData = EMPTY_INGREDIENTDATA;
      this.loadForm(undefined)
    } else {
      const sb = this.lessonService.getItemById(this.lessonId).pipe(
        first(),
        catchError((errorMessage) => {
          return of(EMPTY_INGREDIENTDATA);
        })
      ).subscribe((dt: any) => {
        this.dataFromApi = dt.data;
        this.ingredientData = dt.data.recipe[`${this.fieldControler}`];
        this.loadForm(undefined);
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm(data) {
    this.ingredient = data;
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      id: [data?.id],
      ingredientId: [data?.ingredientId],
      quantity: [data?.quantity],
      unitOfMeasurementId: [data?.unitOfMeasurement?.id],
      image: [data?.image],
      spotlightFacts:this.fb.array([]),
      isOptional:[data?.isOptional],
      isSpotlight:[data?.isSpotlight]
    });
    if (data?.spotlightFacts.length > 0) {
      data.spotlightFacts.forEach(e => {
        this.addQuantity(e);
      })
    } else {
      this.addQuantity(undefined)
    }
  }

  // add ingredient
  add() {
    if (this.id) {
      const formData = this.formGroup.value;
      if(this.formGroup.controls.spotlightFacts.status=="INVALID"){
        formData.spotlightFacts=[];
      }
      this.ingredient = {
        id:formData.id,
        ingredientId: formData.ingredientId,
        ingredient: this.ingredientMaster.find((dt) => {
          if (formData.ingredientId == dt.id)  return dt }),
        unitOfMeasurementId: formData.unitOfMeasurementId,
        quantity: formData.quantity,
        image: formData.image,
        spotlightFacts: formData.spotlightFacts,
        isOptional:formData.isOptional,
        isSpotlight:formData.isSpotlight
      }
      this.ingredientData.forEach((element, i) => {
        if (element.id == this.id) {
          this.ingredientData[i] = this.ingredient;
          this.formGroup.reset();
          this.id=undefined
        }
      });

    } else {
      const formData = this.formGroup.value;
      if(this.formGroup.controls.spotlightFacts.status=="INVALID"){
        formData.spotlightFacts=[];
      }
      this.ingredient = {
        ingredientId: formData.ingredientId,
        ingredient: this.ingredientMaster.find((dt) => {
          if (formData.ingredientId == dt.id)  return dt }),
        unitOfMeasurementId: formData.unitOfMeasurementId,
        quantity: formData.quantity,
        image: formData.image,
        spotlightFacts: formData.spotlightFacts,
        isOptional:formData.isOptional,
        isSpotlight: formData.isSpotlight
      }
      this.ingredientData.push(this.ingredient)
      this.formGroup.reset();
      this.id=undefined
    }

  }

  //edit ingredient
  loadIngredient(event,i) {
    this.id = event.id;
    this.index=i;
    this.loadForm(event);
  }

  //  delete ingredient

  delete(index) {
    this.ingredientData.splice(index, 1)
  }

  spotlightFacts(): FormArray {
    return this.formGroup.get("spotlightFacts") as FormArray
  }

  // create a link function pushed the group in link form array
  addQuantity(data) {
      this.spotlightFacts().push(this.newLinkName(data));
  }

  // form froup of link array methods
  newLinkName(data): FormGroup {
  if(data==undefined){
    return this.fb.group({
      fact: [data,Validators.required],
    })
  }
    return this.fb.group({
      id:[data.id],
      fact: [data.fact,Validators.required],
    })
  }

  // remove link using a index
  removeQuantity(i: number) {
    this.spotlightFacts().removeAt(i);
  }

  onSave() {
    if (this.lessonId) {
      this.ingredientData.forEach(element => {
        element.ingredientId = element.ingredientId
      });
      this.edit();
    }
  }

  edit() {
    this.dataFromApi.recipe[`${this.fieldControler}`] = this.ingredientData;
    let data = {
      id: this.lessonId,
      recipe: {
        id:this.dataFromApi?.recipe.id,
        recipeTitle:this.dataFromApi?.recipe.recipeTitle,
        recipeIngredients:this.ingredientData
      },
    };
    const sbUpdate = this.lessonService.update(data).pipe(
      tap(() => {
        this.clearFormArray();
        this.loadFormData();
        this.changeTab(this.nextStepName);
      }),
      catchError((errorMessage) => {
        return of(this.ingredientData);
      }),
    ).subscribe(res => this.ingredientData = res);
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
