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
  toolRequirements: [],
  kitchenRequirements: '',
  video: '',
  description:'',
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
  isLoading$;
  culinaryTech: any;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  toolMaster: any = []
  languageMaster = [];

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
        description:'',
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
      toolRequirements: [this.culinaryTech.toolRequirements],
      status: [this.culinaryTech.status, Validators.compose([Validators.required])],
      video: [this.culinaryTech.video, Validators.compose([Validators.required])],
      description: [this.culinaryTech.description, Validators.compose([Validators.required])],
      languageId: [this.culinaryTech.systemLanguageId,Validators.compose([Validators.required])],

    });

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

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.culinaryTech.languageId = formData.languages;
    this.culinaryTech.status = formData.status;
    this.culinaryTech.culinaryTechniqueTitle = formData.culinaryTechniqueName;
    this.culinaryTech.toolRequirements = formData.toolRequirements.map(dt => dt.id);
    this.culinaryTech.kitchenRequirements = formData.kitchenRequirements;
    this.culinaryTech.video = formData.video;
    this.culinaryTech.description= formData.description;
    this.culinaryTech.systemLanguageId = formData.languageId;
    this.culinaryTech.referenceId = this.refId;

  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
