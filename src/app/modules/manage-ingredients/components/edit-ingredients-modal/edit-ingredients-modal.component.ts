import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of, Observable } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { ManageNutrientsService } from 'src/app/modules/manage-nutrients/services/manage-nutrients.service';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageIngredientsService } from '../../services/manage-ingredients.service';
import { ManageStandardsService } from '../../../manage-standards/services/manage-standards.service'
import { Ingredients } from '../../_models/ingredients.model';
import { ToastrService } from 'ngx-toastr';

const EMPTY_INGREDIENT: Ingredients = {
  id: undefined,
  ingredientTitle: '',
  images: [],
  easyOrdering: '',
  scienceFacts: [],
  size: '',
  seasonId:null ,
  commonName: '',
  scientificName: '',
  allergen: [],
  substitutes: [],
  additionalNutrients: [],
  status: true
}
@Component({
  selector: 'app-edit-ingredients-modal',
  templateUrl: './edit-ingredients-modal.component.html',
  styleUrls: ['./edit-ingredients-modal.component.scss'],
})
export class EditIngredientsModalComponent implements OnInit {
  ingredients: any;
  tabs = {
    BASIC_TAB: 0,
    QUESTION_TAB: 3,
    SPOTLIGHT_TAB: 1,
    MULTI_SENSORY_TAB: 2
  };
  activeTabId = this.tabs.BASIC_TAB;
  @Input() id: number;
  @Input() refId: number;
  @Input() languageId: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  nutrientMaster: any = [];
  substituteMaster: any = [];
  typeMaster: any = [];
  allergenMaster: any = [];
  ingredientImages: any = [];
  // spotlightQuestions: any = [];
  // multiSensoryQuestions: any = [];
  // matchThePairQuestions:any=[];
  moreIngredientImage: boolean = true;
  fileHeight: any;
  fileWidth: any;
  fileResolutionError: boolean;
  fileSizeError: boolean;
  questionId: any;
  minDate: { year: number; month: number; day: number; };
  fromDateObject: any;
  toDateObject: any;
  newAllergen: string = '';
  allergenErrorMessage: any;
  showAllergenList: boolean = true;
  languageMaster = [];
  seasonMaster: any =[];

  constructor(
    private ingredientsService: ManageIngredientsService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    public nutrientsService: ManageNutrientsService,
    public standardsService: ManageStandardsService,
    public toast: ToastrService
  ) {
    const current = new Date();

    this.nutrientsService.fetch();
    this.nutrientsService.items$.subscribe(res => this.nutrientMaster = res.filter(s => s.status === true));
    this.ingredientsService.fetch();
    this.ingredientsService.items$.subscribe(res => {
      this.substituteMaster = res.filter(s => s.status === true && s.id != this.id);
    });
  }

  ngOnInit(): void {
    this.isLoading$ = this.ingredientsService.isLoading$;
    if (this.refId) {
      this.ingredientsService.getLanguageListByFilter('ingredients', this.refId).subscribe((res) => {
        this.languageMaster = res.data;
      }, (e) => {
        console.log(e)
      })
    } else {
      this.loadLanguage()
    }
    this.loadMasters();
    this.loadSubject();
    // this.loadTags();
  }

  // Load system languages
  loadLanguage() {
    this.ingredientsService.getLanguageList().subscribe((res) => {
      this.languageMaster = res.data;
    }, (e) => {
      console.log(e)
    })
  }

  changeTab() {
    this.activeTabId = this.tabs.BASIC_TAB
    this.loadForm()
  }

  loadMasters() {
    const sb = this.ingredientsService.loadMasters().pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_INGREDIENT);
      })
    ).subscribe((response: any) => {
      this.allergenMaster = response?.[0].data;
      this.seasonMaster= response?.[1].data;
    });
    this.subscriptions.push(sb);

  }
  loadSubject() {
    if (!this.id) {
      this.ingredients = {
        id: undefined,
        ingredientTitle: '',
        images: [],
        easyOrdering: '',
        //  scienceFacts: [],
        size: '',
        seasonId: null,
        commonName: '',
        scientificName: '',
        allergen: [],
        substitutes: [],
        additionalNutrients: [],
        status: true
      }
      this.loadForm();
    } else {
      const sb = this.ingredientsService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_INGREDIENT);
        })
      ).subscribe((ingredient: any) => {
        const current = new Date();
        this.ingredients = ingredient.data;
        this.ingredients.allergen = this.ingredients.allergens.map(dt => dt.allergen);
        this.ingredients.substitutes = this.ingredients.substitutes.map(dt => dt.ingredient);
        this.ingredients.additionalNutrients = this.ingredients.additionalNutrients.map(dt => dt.nutrient);
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      ingredientName: [this.ingredients.ingredientTitle, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      images: [this.ingredients.images],
      linkForEasyOrdering: [this.ingredients.easyOrdering],
      size: [this.ingredients.size],
      status: [this.ingredients.status, Validators.compose([Validators.required])],
      seasonId: [this.ingredients.season?.id, Validators.compose([Validators.required])],
      commonNameOfIngredient: [this.ingredients.commonName],
      scientificNameOfIngredient: [this.ingredients.scientificName],
      allergen: [this.ingredients.allergen],
      substitutes: [this.ingredients.substitutes],
      additionalNutrients: [this.ingredients.additionalNutrients],
      languageId: [this.ingredients.systemLanguageId,Validators.compose([Validators.required])],

      // spotlightQuestions:this.fb.array([]),
      // multiSensoryQuestions:this.fb.array([]),
      // matchThePairQuestions:this.fb.array([])
    });
    /*  if (this.ingredients.scienceFacts?.length > 0) {
       this.ingredients.scienceFacts.forEach(e => {
         this.addQuantity(e);
       })
     } else {
       this.addQuantity(undefined)
     } */
    /* if (this.ingredients.spotlightQuestions?.length > 0) {
      this.spotlightQuestions=[...this.ingredients.spotlightQuestions]
    }
    if (this.ingredients.multiSensoryQuestions?.length > 0) {
        this.multiSensoryQuestions=[...this.ingredients.multiSensoryQuestions]
    }
    if (this.ingredients.matchThePairQuestions?.length > 0) {
      this.matchThePairQuestions=[...this.ingredients.matchThePairQuestions]
  } */
    if (this.ingredients.images?.length > 0) {
      this.ingredientImages = [...this.ingredients.images];
      this.moreIngredientImage = false;
    }
  }

  save() {
    this.prepareCustomer();
    if (this.ingredients.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.ingredientsService.update(this.ingredients).pipe(
      tap((res: any) => {
        if (res.status == 200) {
          this.toast.success(res.message, "Success");
        }
        else if (res.status == 409) {
          this.toast.error(res.message, "Error");
        }
        else {
          this.toast.error("Something went wrong", "Error");
        }
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.toast.error("Something wrong", "Error")
        this.modal.dismiss(errorMessage);
        return of(this.ingredients);
      }),
    ).subscribe(res => {
      this.ingredients = res;

    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.ingredientsService.create(this.ingredients).pipe(
      tap((res: any) => {
        if (res.status == 200) {
          this.toast.success(res.message, "Success");
        }
        else if (res.status == 409) {
          this.toast.error(res.message, "Error");
        }
        else {
          this.toast.error("Something went wrong", "Error");
        }
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.ingredients);
      }),
    ).subscribe((res: any) => {
      this.ingredients = res
    });
    this.subscriptions.push(sbCreate);
  }

  selectAllTool(event) {
    console.log(event)
  }

  selectTool(event) {
    console.log(event)

  }
  onDeselectTool(event) {
    console.log(event)
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.ingredients.ingredientTitle = formData.ingredientName;
    this.ingredients.easyOrdering = formData.linkForEasyOrdering;
    this.ingredients.images = formData.images;
    delete this.ingredients.size 
    this.ingredients.commonName = formData.commonNameOfIngredient;
    this.ingredients.scientificName = formData.scientificNameOfIngredient;
    if (formData.allergen.length > 0) {
      this.ingredients.allergens = formData.allergen.map(dt => dt.id);
    }
    if (formData.substitutes?.length > 0) {
      this.ingredients.substitutes = formData.substitutes.map(dt => dt.id);
    }
    if (formData.additionalNutrients?.length > 0) {
      this.ingredients.additionalNutrients = formData.additionalNutrients.map(dt => dt.id);;
    }
    this.ingredients.status = formData.status;
    this.ingredients.seasonId = formData.seasonId;
    this.ingredients.systemLanguageId = formData.languageId;
    this.ingredients.referenceId = this.refId;
  }

  // load link as a form array
  scienceFact(): FormArray {
    return this.formGroup.get("scienceFact") as FormArray
  }

  // create a link function pushed the group in link form array
  addQuantity(data) {
    this.scienceFact().push(this.newLinkName(data));
  }

  // form froup of link array methods
  newLinkName(data): FormGroup {
    if (data == undefined) {
      return this.fb.group({
        fact: [data, Validators.required],
      })
    }
    return this.fb.group({
      id: [data.id],
      fact: [data.fact, Validators.required],
    })
  }

  // remove link using a index
  removeQuantity(i: number) {
    this.scienceFact().removeAt(i);
  }

  uploadIngredientImage(event) {
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

          this.ingredientImages.push({ image: e.target.result });
          if (this.ingredientImages?.length == 1) {
            this.moreIngredientImage = false;

          }
          const sbCreate = this.ingredientsService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
            let tempArray = [];
            res.data.forEach(element => {
              tempArray.push(element.mediaPath)
            });
            this.formGroup.patchValue({
              images: tempArray
            })
          });
          this.subscriptions.push(sbCreate);
        }
      }
    }

  }

  removeIngredientImage(data) {
    let tempArray = [];
    const index: number = this.ingredientImages.indexOf(data);
    if (index !== -1) {
      this.ingredientImages.splice(index, 1);
    }
    this.formGroup.patchValue({
      images: this.ingredientImages
    })
    if (this.ingredientImages?.length == 1) {
      this.moreIngredientImage = false;
    }
    else {
      this.moreIngredientImage = true
    }
  }



  showAllergen() {
    this.showAllergenList = !this.showAllergenList;
  }


  addAllergen() {
    if(this.newAllergen!=""){
      let data = {
        allergenTitle: this.newAllergen,
        status: true
      }
    
    this.ingredientsService.addNewAllergen(data).subscribe((res: any) => {
      this.loadMasters();
      this.showAllergenList = true;
    }, (e) => {
      if (e.error.status == 409) {
        this.allergenErrorMessage = e.error.message;
        this.newAllergen = "";
      }
    });
  }
  }

  resetAllergen() {
    this.newAllergen = ""
    this.allergenErrorMessage = "";
    this.showAllergenList = true;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
