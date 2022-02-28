import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { FormValidationServices } from "src/app/_metronic/shared/form-validation.service";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { of, Subscription } from "rxjs";
import { ManageLessonsService } from "../../services/manage-lessons.service";
import { catchError, first, tap } from "rxjs/operators";

const EMPTY_RECIPS: any = {
  reciepsName: "",
  country: "",
  alternativeName: "",
  estimatesTime: "",
  serves: 1,
  ingredients: null,
  toolsBigChef: null,
  toolslittleChef: null,
  techniques: null,
  holiday: "",
  quantity: "",
};

@Component({
  selector: "app-recips-form",
  templateUrl: "./recips-form.component.html",
  styleUrls: ["./recips-form.component.scss"],
})
export class RecipsFormComponent implements OnInit {
  editor = ClassicEditor;
  @Input() fieldControler;
  @Input() lessonId;
  @Input() form;
  @Input() id: number;
  @Input() activeTabId: number;
  @Input() previousStepName;
  @Input() nextStepName;
  @Output() changeActiveTab: EventEmitter<number> = new EventEmitter<number>();
  serveMaster = [
    { id: 1, Value: 1 },
    { id: 2, Value: 2 },
    { id: 3, Value: 3 },
    { id: 4, Value: 4 },
    { id: 5, Value: 5 },
    { id: 6, Value: 6 },
    { id: 7, Value: 7 },
    { id: 8, Value: 8 },
    { id: 9, Value: 9 },
    { id: 10, Value: 10 },
  ];
  isLoading$;
  private subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  recipes: any;
  subjectMaster: any = [];
  standardMaster: any = [];
  countryMaster: any = [];
  unitOfMeasureMaster: any = [];
  toolBigChefMaster: any = [];
  toolLittleChefMaster: any = [];
  pushInArrayController: FormGroup;
  dataFromApi: any;
  tabs = {
    BASIC_TAB: 0,
    RECIPES_TAB: 1,
    EXPERIMENT_TAB: 2,
    QUESTION_TAB: 3,
    ACTIVITY_TAB: 4,
  };
  config = {
    placeholder: "Enter Quick blurb",
  };
  recipeImages = [];
  moreRecipeImage: boolean = true;
  fileSize = 20971520;
  fileWidth = 200;
  fileHeight = 400;
  fileSizeError = false;
  fileResolutionError = false;

  constructor(
    private fb: FormBuilder,
    public validationService: FormValidationServices,
    private lessonService: ManageLessonsService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.lessonService.isLoading$;
    this.loadMaster();
    this.loadRecipes();
  }

  loadMaster() {
    this.lessonService.getRecipeMaster().subscribe((res:any)=>{
      this.countryMaster=res[0].data.filter((s) => s.status === true);
      this.toolBigChefMaster = res[1].data.filter((s) => s.status === true);
      this.toolLittleChefMaster = res[1].data.filter((s) => s.status === true);
    },(e)=>{
      console.log(e)
    })
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
    this.changeActiveTab.emit(tabId);
    this.prepareForm();
  }

  loadRecipes() {
    if (!this.lessonId) {
      this.recipes = EMPTY_RECIPS;
      this.loadForm();
    } else {
      const sb = this.lessonService
        .getItemById(this.lessonId)
        .pipe(
          first(),
          catchError((errorMessage) => {
            return of(EMPTY_RECIPS);
          })
        )
        .subscribe((dt: any) => {
          this.dataFromApi = dt.data;
          this.recipes = dt.data.recipe ? dt.data.recipe : EMPTY_RECIPS;
          if (this.recipes.littleChefTools?.length > 0) {
            this.recipes.littleChefTools = this.recipes?.littleChefTools.map(
              (dt) => dt.tool
            );
          }
          if (this.recipes.bigChefTools?.length > 0) {
            this.recipes.bigChefTools = this.recipes?.bigChefTools.map(
              (dt) => dt.tool
            );
          }
          this.loadForm();
        });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      reciepsName: [this.recipes?.recipeTitle, Validators.required],
      country: [this.recipes?.country?.id],
      alterNativeName: [this.recipes?.alternativeName],
      estimatesTime: [this.recipes?.estimatedMakeTime],
      serves: [this.recipes?.serves],
      toolsBigChef: [this.recipes?.bigChefTools],
      toolslittleChef: [this.recipes?.littleChefTools],
      holidays: [this.recipes?.holiday],
      recipeImage:[this.recipes?.recipeImage],
      isChefInHouse:[this.recipes?.isChefInHouse],
      isChefAmbassador:[this.recipes?.isChefAmbassador]
    });

    if(this.recipes?.recipeImage){
      this.recipeImages.push({image:this.recipes?.recipeImage})
      this.moreRecipeImage=false;
    }
  }
  onSelectTech(event) {
    console.log(event);
  }

  private prepareForm() {
    const formData = this.formGroup.value;
    this.recipes.recipeTitle = formData.reciepsName;
    this.recipes.countryId = formData.country;
    this.recipes.alternativeName = formData.alterNativeName;
    this.recipes.estimatedMakeTime = formData.estimatesTime;
    this.recipes.serves = formData.serves;
    if(formData.toolsBigChef){
      this.recipes.bigChefTools = formData.toolsBigChef.map((dt) => dt.id);
    }
    if(formData.toolslittleChef){
      this.recipes.littleChefTools = formData.toolslittleChef.map((dt) => dt.id);
    }
    this.recipes.holiday = formData.holidays;
    this.recipes.recipeImage=formData.recipeImage;
    this.recipes.isChefInHouse=formData.isChefInHouse;
    this.recipes.isChefAmbassador=formData.isChefAmbassador;
  }
  onSave() {
    this.prepareForm();
    if (this.lessonId) {
      this.edit();
    }
  }

  edit() {
    let data = {
      id: this.lessonId,
      recipe: this.recipes,
    };
    const sbUpdate = this.lessonService
      .update(data)
      .pipe(
        tap(() => {
          this.loadRecipes();
          this.changeTab(this.nextStepName);
        }),
        catchError((errorMessage) => {
          return of(this.recipes);
        })
      )
      .subscribe((res) => (this.recipes = res));
    this.subscriptions.push(sbUpdate);
  }

  uploadRecipeImage(event){
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

          this.recipeImages.push({image:e.target.result});
          if (this.recipeImages?.length == 1) {
            this.moreRecipeImage = false;

          }
          const sbCreate= this.lessonService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
            let tempArray=[];
            res.data.forEach(element => {
              tempArray.push(element.mediaPath)
            });
            this.formGroup.patchValue({
              recipeImage: tempArray[0]
            })
          });
          this.subscriptions.push(sbCreate);
        }
      }
    }
  }
  removeRecipeImage(event){
    const index: number = this.recipeImages.indexOf(event);
    if (index !== -1) {
    this.recipeImages.splice(index,1);
    }
    this.formGroup.patchValue({
      recipeImage: null
    })
    if (this.recipeImages?.length == 1) {
      this.moreRecipeImage = false;
    }
      else{
        this.moreRecipeImage = true
    }
  }

 changeChefType(e){
   if(e.target.id=="isChefInHouse" && e.target.checked){
      this.formGroup.controls['isChefAmbassador'].patchValue(false);
   }else{
    this.formGroup.controls['isChefInHouse'].patchValue(false);
   }
 }

}
