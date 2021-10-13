import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { Subjects } from 'src/app/modules/manage-subjects/_model/subject.model';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageNutrientsService } from '../../services/manage-nutrients.service';
import { Nutrients } from '../../_model/nutrients.model';
const EMPTY_NUTRIENTS: Nutrients = {

  id: undefined,
  nutrientTitle: '',
  relatedQuestions: [],
  spotlightQuestion: [],
  multiSensoryQuestion: [],
  spotlightVideo: '',
  typeId: '',
  categoryId: '',
  description: '',
  status: true,
}

@Component({
  selector: 'app-edit-nutrients-modal',
  templateUrl: './edit-nutrients-modal.component.html',
  styleUrls: ['./edit-nutrients-modal.component.scss']
})
export class EditNutrientsModalComponent implements OnInit {
  tabs = {
    BASIC_TAB: 0,
    SPOTLIGHT_TAB: 1,
    MULTI_SENSORY_TAB: 2
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => recpes | 2 => preparation

  @Input() id: number;
  @Input() refId: number;
  @Input() languageId: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  nutrients: any;
  formGroup: FormGroup;
  typeMaster: any = []
  categoryMaster: any = []
  spotlightQuestions: any = [];
  //multiSensoryQuestions: any = [];
  languageMaster=[];
  questionId: any;
  constructor(
    private nutrientsService: ManageNutrientsService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    private toast:ToastrService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.nutrientsService.isLoading$;
    if(this.refId){
      this.nutrientsService.getLanguageListByFilter('nutrients',this.refId).subscribe((res)=>{
        this.languageMaster=res.data;
      },(e)=>{
        console.log(e)
      })
    }else{
      this.loadLanguage()
    }
    this.loadMasters();
    this.loadNutrient();
  }


   // Load system languages
   loadLanguage(){
    this.nutrientsService.getLanguageList().subscribe((res)=>{
      this.languageMaster=res.data;
    },(e)=>{
      console.log(e)
    })
  }

  loadMasters() {
    const sb = this.nutrientsService.loadMasters().pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_NUTRIENTS);
      })
    ).subscribe((response: any) => {

      this.typeMaster = response?.[0].data;
      this.categoryMaster = response?.[2].data;
    });
    this.subscriptions.push(sb);

  }

  loadNutrient() {
    if (!this.id) {
      //this.nutrients = EMPTY_NUTRIENTS;
      this.nutrients = {
        id: undefined,
        nutrientTitle: '',
        relatedQuestions: [],
        spotlightQuestion: [],
       // multiSensoryQuestion: [],
        spotlightVideo: '',
        typeId: '',
        categoryId: '',
        description: '',
        status: true,
      };
      this.loadForm();
    } else {
      const sb = this.nutrientsService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_NUTRIENTS);
        })
      ).subscribe((subject: any) => {
        this.nutrients = subject.data;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {

    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      nutrientName: [this.nutrients.nutrientTitle, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      spotlightVideo: [this.nutrients.spotlightVideo],
      type: [this.nutrients.type?.id, Validators.compose([Validators.required])],
      category: [this.nutrients.category?.id, Validators.compose([Validators.required])],
      description: [this.nutrients.description, Validators.compose([Validators.required])],
      relatedQuestions: this.fb.array([]),
      spotlightQuestions:this.fb.array([]),
     // multiSensoryQuestions:this.fb.array([]),
      status: [this.nutrients.status, Validators.compose([Validators.required])],
      languageId:[this.nutrients.systemLanguageId],

    });
    if (this.nutrients?.relatedQuestions.length > 0) {
      this.nutrients.relatedQuestions.forEach(e => {
        this.addQuantity(e);
      })
    } else {
      this.addQuantity(undefined)
    }
    if (this.nutrients?.spotlightQuestions?.length > 0) {
      this.spotlightQuestions=[...this.nutrients.spotlightQuestions]
    }
 /*    if (this.nutrients?.multiSensoryQuestions?.length > 0) {
        this.multiSensoryQuestions=[...this.nutrients.multiSensoryQuestions]
    } */
  }

  // load link as a form array
  relatedQuestion(): FormArray {
    return this.formGroup.get("relatedQuestions") as FormArray
  }

  // create a link function pushed the group in link form array
  addQuantity(data) {
    this.relatedQuestion().push(this.newLinkName(data));
  }

  // form froup of link array methods
  newLinkName(data): FormGroup {
    if (data == undefined) {
      return this.fb.group({
        question: [data],
      })
    }
    return this.fb.group({
      id: [data.id],
      question: [data.question],
    })
  }

  // remove link using a index
  removeQuantity(i: number) {
    this.relatedQuestion().removeAt(i);
  }
  createSpotQuestion (data){
    if(data.id){
      let index = this.spotlightQuestions.indexOf(data);
      this.spotlightQuestions[index] = data;
    }else{
      this.spotlightQuestions.push(data)
    }
  }
  /* createSensoryQuestion (data){
    if(data.id){
      let index = this.multiSensoryQuestions.indexOf(data);
      this.multiSensoryQuestions[index] = data;
    }else{
      this.multiSensoryQuestions.push(data)
    }
  } */
  editSpotQuestion(data) {
    this.questionId = data.id
  }

  /* editSensoryQuestion(data) {
    this.questionId = data.id
  } */

  deleteSpotQuestion(data) {
    const index: number = this.spotlightQuestions.indexOf(data);
    if (index !== -1) {
      this.spotlightQuestions.splice(index, 1);
    }

  }
/*
  deleteSensoryQuestion(data) {
    const index: number = this.multiSensoryQuestions.indexOf(data);
    if (index !== -1) {
      this.multiSensoryQuestions.splice(index, 1);
    }

  } */
changeTab(){
  this.activeTabId =this.tabs.BASIC_TAB
  this.loadForm()
}
  save() {
    this.prepareCustomer();
    if (this.nutrients.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.nutrientsService.update(this.nutrients).pipe(
      tap((res:any) => {
        if(res.status==200){
          this.toast.success(res.message,"Success");
        }
        else if(res.status==409){
          this.toast.error(res.message,"Error");
        }
        else{
          this.toast.error("Something went wrong","Error");
        }
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.nutrients);
      }),
    ).subscribe(res => this.nutrients = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.nutrientsService.create(this.nutrients).pipe(
      tap((res:any) => {
        if(res.status==200){
          this.toast.success(res.message,"Success");
        }
        else if(res.status==409){
          this.toast.error(res.message,"Error");
        }
        else{
          this.toast.error("Something went wrong","Error");
        }
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.nutrients);
      }),
    ).subscribe((res: Nutrients) => this.nutrients = res);
    this.subscriptions.push(sbCreate);
  }


  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.nutrients.nutrientTitle = formData.nutrientName;
    this.nutrients.spotlightVideo = formData.spotlightVideo;
    this.nutrients.typeId = formData.type;
    this.nutrients.categoryId = formData.category;
    this.nutrients.description = formData.description;
    this.nutrients.status = formData.status;
    this.nutrients.systemLanguageId=formData.languageId;
    this.nutrients.referenceId=this.refId;
    this.nutrients.relatedQuestions = formData.relatedQuestions;
    this.nutrients.spotlightQuestions = this.spotlightQuestions;
 //   this.nutrients.multiSensoryQuestions = this.multiSensoryQuestions;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
