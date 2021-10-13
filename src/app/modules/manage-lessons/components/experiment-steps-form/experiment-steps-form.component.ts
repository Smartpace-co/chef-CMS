
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { ManageCulinaryTechniquesService } from 'src/app/modules/manage-culinary-techniques/service/manage-culinary-techniques.service';
import { ManageIngredientsService } from 'src/app/modules/manage-ingredients/services/manage-ingredients.service';
import { ToolsService } from 'src/app/modules/manage-tools/services/tools.service';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageLessonsService } from '../../services/manage-lessons.service';
// import { Experiment } from '../../_models/lessions.model';

const EMPTY_EXPRESSION = {
  experimentTitle: '',
  experimentIngredients: [],
  experimentTools: [],
  experimentQuestions: [],
  experimentSteps: []
}

@Component({
  selector: 'app-experiment-steps-form',
  templateUrl: './experiment-steps-form.component.html',
  styleUrls: ['./experiment-steps-form.component.scss']
})
export class ExperimentStepsFormComponent implements OnInit, OnDestroy {
  @Input() fieldControler;
  @Input() lessonId;
  @Input() form;
  @Input() id: number;
  @Input() activeTabId: number;
  @Input() previousStepName;
  @Input() nextStepName;
  @Output() changeActiveTab: EventEmitter<number> = new EventEmitter<number>();
  formGroup: FormGroup;
  toolBigChefMaster: any = [];
  toolLittleChefMaster: any = [];
  ingredientMaster: any = [];
  toolsMaster: any = [];
  dataFromApi: any;
  experiments;
  private subscriptions: Subscription[] = [];
  isLoading$;
  constructor(
    private fb: FormBuilder,
    public validationService: FormValidationServices,
    private ingredientsService: ManageIngredientsService,
    private lessonService: ManageLessonsService,
    private toolservice: ToolsService,
  ) {

    // this.techniqueservice.fetch();
    // this.techniqueservice.items$.subscribe(res => this.techniquesMaster = res.filter(s => s.status === true));
    this.lessonService.fetch();
  }

  ngOnInit(): void {
    this.isLoading$ = this.lessonService.isLoading$;
    // this.loadForm();
    this.loadMasters();
    this.loadExperimentData();
  }

  loadMasters() {
    this.lessonService.getExperimentMaster().subscribe((res: any) => {
      this.toolsMaster = res[0].data.filter((s) => s.status === true);
      this.ingredientMaster = res[1].data.filter((s) => s.status === true);
    }, (e) => {
      console.log(e)
    })
  }
  // load experiment form with repect to id is available or not
  loadExperimentData() {
    if (!this.lessonId) {
      this.experiments = EMPTY_EXPRESSION;
      this.loadForm();
    } else {
      const sb = this.lessonService.getItemById(this.lessonId).pipe(
        first(),
        catchError((errorMessage) => {
          return of(EMPTY_EXPRESSION);
        })
      ).subscribe((experiment: any) => {
        this.dataFromApi = experiment.data;
        this.experiments = experiment.data.experiment ? experiment.data.experiment : EMPTY_EXPRESSION;
        this.experiments.experimentIngredients = this.experiments.experimentIngredients.map(dt => dt.ingredient);
        this.experiments.experimentTools = this.experiments.experimentTools.map(dt => dt.tool);
        //  this.experiments.experimentTechniques = this.experiments.experimentTechniques.map(dt => dt.culinary_technique);

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
    delete this.dataFromApi.links;
    delete this.experiments.experimentQuestions;
    this.dataFromApi.experiment = this.experiments;

    let expdata = {
      id: this.lessonId,
      experiment: this.experiments,
    };
    
    const sbUpdate = this.lessonService.update(expdata).pipe(
      tap(() => {
        this.loadExperimentData();
        this.changeTab(this.nextStepName);
      }),
      catchError((errorMessage) => {
        return of(this.experiments);
      }),
    ).subscribe(res => this.experiments = res);
    this.subscriptions.push(sbUpdate);
  }

  // load form fields
  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      experimentName: [this.experiments?.experimentTitle, Validators.required],
      ingredients: [this.experiments?.experimentIngredients],
      tools: [this.experiments?.experimentTools],
      //techniques: [this.experiments?.experimentTechniques],
      // steps: [this.experiments?.steps, Validators.required],
      experimentsStepsArray: this.fb.array([]),
      estimatedMakeTime: [this.experiments?.estimatedMakeTime],
      description: [this.experiments?.description],
      fact: [this.experiments?.fact],
      experimentStepsTrack: [this.experiments?.experimentStepsTrack]
    });

    //  this.addQuantity(undefined)

    if (this.dataFromApi.experiment?.experimentSteps.length > 0) {
      this.dataFromApi.experiment.experimentSteps.forEach(e => {
        this.addQuantity(e);
      })
    } else {
      this.addQuantity(undefined)
    }

  }
  private prepareForm() {
    const formData = this.formGroup.value
    this.experiments.experimentTitle = formData.experimentName;
    this.experiments.experimentIngredients = formData.ingredients.map(dt => dt.id);
    this.experiments.experimentTools = formData.tools.map(dt => dt.id);
    // this.experiments.experimentTechniques = formData.techniques.map(dt => dt.id);
    this.experiments.experimentSteps = formData.experimentsStepsArray
    this.experiments.estimatedMakeTime = formData.estimatedMakeTime;
    this.experiments.description = formData.description;
    this.experiments.fact = formData.fact;
    this.experiments.experimentStepsTrack = formData.experimentStepsTrack;

  }
  // change tab value
  changeTab(tabId: number) {
    this.activeTabId = tabId;
    this.changeActiveTab.emit(tabId);
    this.prepareForm();
  }


  // load link as a form array 
  experimentsStepArray(): FormArray {
    return this.formGroup.get("experimentsStepsArray") as FormArray
  }
  // create a link function pushed the group in link form array
  addQuantity(data) {
    this.experimentsStepArray().push(this.newLinkName(data));
  }

  // form froup of link array methods
  newLinkName(data): FormGroup {
    if (data == undefined) {
      return this.fb.group({
        text: [data, Validators.required],
        link: [data],
        image: [data]
      })
    }
    return this.fb.group({
      id: [data.id],
      text: [data.text, Validators.required],
      link: [data.link],
      image: [data.image]
    })
  }

  // remove link using a index
  removeQuantity(i: number) {
    this.experimentsStepArray().removeAt(i);
  }

  uploadImage(event, item) {
    console.log(item)
    if (event.target.files && event.target.files.length == 1) {
      const sbCreate = this.lessonService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
        item.controls['image'].patchValue(res.data[0].mediaPath)
      });
      this.subscriptions.push(sbCreate);
    }
  }

  uploadTrack(event, fieldName) {
    if (event.target.files && event.target.files.length == 1) {
      const sbCreate = this.lessonService.audioUpload(event.target.files).pipe().subscribe((res: any) => {
        this.formGroup.controls[fieldName].patchValue(res.data[0].mediaPath)
      });
      this.subscriptions.push(sbCreate);
    }
  }

  removeTrack(fieldName) {
    this.formGroup.controls[fieldName].patchValue('');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
