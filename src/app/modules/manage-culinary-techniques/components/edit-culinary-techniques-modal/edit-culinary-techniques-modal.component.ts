import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { Country } from 'src/app/modules/manage-countries/-models/country.model';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageCulinaryTechniquesService } from '../../service/manage-culinary-techniques.service';
import { ToolsService } from '../../../manage-tools/services/tools.service';
import { CulinaryTechniques } from '../../_model/culinary-techniques.model';
import { ToastrService } from 'ngx-toastr';

const EMPTY_CTM: CulinaryTechniques = {
  id: undefined,
  culinaryTechniqueTitle: '',
  easyOrdering: '',
  tagId: '',
  categoryId: '',
  toolRequirements: [],
  kitchenRequirements: '',
  video: '',
  spotlightVideo: '',
  spotlightQuestions: [],
  multiSensoryQuestions: [],
  status: true

}
@Component({
  selector: 'app-edit-culinary-techniques-modal',
  templateUrl: './edit-culinary-techniques-modal.component.html',
  styleUrls: ['./edit-culinary-techniques-modal.component.scss']
})
export class EditCulinaryTechniquesModalComponent implements OnInit {
  @Input() id: number;
  @Input() refId: number;
  @Input() languageId: number;
  tabs = {
    BASIC_TAB: 0,
    SPOTLIGHT_TAB: 1,
    MULTI_SENSORY_TAB: 2
  };
  activeTabId = this.tabs.BASIC_TAB;
  isLoading$;
  culinaryTech: any;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  toolMaster: any = []
  categoryMaster: any = []
  tagsMaster: any = []
  languageMaster = [];
  spotlightQuestions: any = [];
  multiSensoryQuestions: any = [];
  questionId: any;
  isNewCategory = false;
  showCategoryList = true;
  newCategory = "";
  categoryErrorMessage: any;
  constructor(
    private culineryService: ManageCulinaryTechniquesService,
    private toolService: ToolsService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private toast:ToastrService,
    public validationService: FormValidationServices) {
    this.toolService.fetch()
    this.toolService.items$.subscribe(res => this.toolMaster = res.filter(s => s.status === true));

  }

  ngOnInit(): void {
    this.isLoading$ = this.culineryService.isLoading$;
    if (this.refId) {
      this.culineryService.getLanguageListByFilter('culinary_techniques', this.refId).subscribe((res) => {
        this.languageMaster = res.data;
      }, (e) => {
        console.log(e)
      })
    } else {
      this.loadLanguage()
    }
    this.loadMasters();
    this.loadCulinery();
  }


  // Load system languages
  loadLanguage() {
    this.culineryService.getLanguageList().subscribe((res) => {
      this.languageMaster = res.data;
    }, (e) => {
      console.log(e)
    })
  }

  loadMasters() {
    const sb = this.culineryService.loadMasters().pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_CTM);
      })
    ).subscribe((response: any) => {
      this.categoryMaster = response?.[0].data;
      this.tagsMaster = response?.[1].data;
    });
    this.subscriptions.push(sb);
  }

  loadCulinery() {
    if (!this.id) {
      //this.culinaryTech = EMPTY_CTM;
      this.culinaryTech = {
        id: undefined,
        culinaryTechniqueTitle: '',
        easyOrdering: '',
        tagId: '',
        categoryId: '',
        toolRequirements: [],
        kitchenRequirements: '',
        video: '',
        spotlightVideo: '',
        spotlightQuestions: [],
        multiSensoryQuestions: [],
        status: true
      }
      this.loadForm();
      this.formGroup.reset();
    } else {
      const sb = this.culineryService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CTM);
        })
      ).subscribe((culinaryTech: any) => {
        this.culinaryTech = culinaryTech.data;
        this.culinaryTech.toolRequirements = this.culinaryTech.toolRequirements.map(dt => dt.tool);
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      culinaryTechniqueName: [this.culinaryTech.culinaryTechniqueTitle, Validators.compose([Validators.required])],
      kitchenRequirements: [this.culinaryTech.kitchenRequirements],
      linkforEasyOrdering: [this.culinaryTech.easyOrdering],
      tags: [this.culinaryTech.tag?.id],
      toolRequirements: [this.culinaryTech.toolRequirements],
      status: [this.culinaryTech.status, Validators.compose([Validators.required])],
      video: [this.culinaryTech.video],
      spotlightVideo: [this.culinaryTech.spotlightVideo],
      category: [this.culinaryTech.category?.id],
      spotlightQuestions: this.fb.array([]),
      multiSensoryQuestions: this.fb.array([]),
      languageId: [this.culinaryTech.systemLanguageId,Validators.compose([Validators.required])],

    });

    if (this.culinaryTech.spotlightQuestions?.length > 0) {
      this.spotlightQuestions = [...this.culinaryTech.spotlightQuestions]
    }
    if (this.culinaryTech.multiSensoryQuestions?.length > 0) {
      this.multiSensoryQuestions = [...this.culinaryTech.multiSensoryQuestions]
    }
  }

  save() {
    this.prepareCustomer();
    if (this.culinaryTech.id) {
      this.edit();
    } else {
      this.create();
    }
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
  edit() {
    const sbUpdate = this.culineryService.update(this.culinaryTech).pipe(
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
        return of(this.culinaryTech);
      }),
    ).subscribe(res => this.culinaryTech = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.culineryService.create(this.culinaryTech).pipe(
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
        return of(this.culinaryTech);
      }),
    ).subscribe((res: any) => this.culinaryTech = res);
    this.subscriptions.push(sbCreate);
  }

  createSpotQuestion(data) {
    if (data.id) {
      let index = this.spotlightQuestions.indexOf(data);
      this.spotlightQuestions[index] = data;
    } else {
      this.spotlightQuestions.push(data)
    }
  }
  createSensoryQuestion(data) {
    if (data.id) {
      let index = this.multiSensoryQuestions.indexOf(data);
      this.multiSensoryQuestions[index] = data;
    } else {
      this.multiSensoryQuestions.push(data)
    }
  }
  editSpotQuestion(data) {
    this.questionId = data.id
  }

  editSensoryQuestion(data) {
    this.questionId = data.id
  }

  deleteSpotQuestion(data) {
    const index: number = this.spotlightQuestions.indexOf(data);
    if (index !== -1) {
      this.spotlightQuestions.splice(index, 1);
    }

  }

  deleteSensoryQuestion(data) {
    const index: number = this.multiSensoryQuestions.indexOf(data);
    if (index !== -1) {
      this.multiSensoryQuestions.splice(index, 1);
    }

  }

  changeTab() {
    this.activeTabId = this.tabs.BASIC_TAB
    this.loadForm()
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    console.log(formData)
    this.culinaryTech.languageId = formData.languages;
    this.culinaryTech.status = formData.status;
    this.culinaryTech.culinaryTechniqueTitle = formData.culinaryTechniqueName;
    this.culinaryTech.safetyLevelId = formData.safetylevel;
    this.culinaryTech.easyOrdering = formData.linkforEasyOrdering;
    this.culinaryTech.tagId = formData.tags;
    this.culinaryTech.categoryId = formData.category;
    this.culinaryTech.usesId = formData.uses;
    this.culinaryTech.toolRequirements = formData.toolRequirements.map(dt => dt.id);
    this.culinaryTech.kitchenRequirements = formData.kitchenRequirements;
    this.culinaryTech.video = formData.video;
    this.culinaryTech.spotlightQuestions = this.spotlightQuestions;
    this.culinaryTech.multiSensoryQuestions = this.multiSensoryQuestions;
    this.culinaryTech.systemLanguageId = formData.languageId;
    this.culinaryTech.referenceId = this.refId;

  }

  showCategory() {
    this.showCategoryList = !this.showCategoryList;
  }

  addCategory() {
    let data = {
      categoryTitle: this.newCategory,
      status: true
    }
    this.culineryService.addNewCategory(data).subscribe((res: any) => {
      this.loadMasters();
      this.showCategoryList = true;
    }, (e) => {
      if (e.error.status == 409) {
        this.categoryErrorMessage = e.error.message;
        this.newCategory = "";
      }
    });

  }

  resetCategory() {
    this.newCategory = ""
    this.showCategoryList = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
