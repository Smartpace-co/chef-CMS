import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subscription, of, Observable } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { ManageCountriesService } from 'src/app/modules/manage-countries/services/manage-countries.service';
import { ManageIngredientsService } from 'src/app/modules/manage-ingredients/services/manage-ingredients.service';
import { ManageStandardsService } from 'src/app/modules/manage-standards/services/manage-standards.service';
import { ManageLessonsService } from '../../services/manage-lessons.service';
import { Lesson } from '../../_models/lessions.model';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';

const EMPTY_LESSON: any = {
  id: undefined,
  lessonTitle: '',
  createrName: '',
  reviewerName: '',
  learningObjectivesForTeacher: '',
  learningObjectivesForTeacherTrack:'',
  learningObjectivesForStudent: '',
  learningObjectivesForStudentTrack:'',
  greeting: '',
  linguistic: '',
  greetingTrack: '',
  goodbye: '',
  goodbyeLinguistic: '',
  goodbyeTrack: '',
  storyTime:5,
  chefIntroductions: [],
  teacherInstructions: [],
  safetySteps: [],
  safetyStepsTrack:'',
 // languageId: null,
  gradeId: '',
  multiSensoryActivity: '',
  // cleanUpStep: '',
  funFact: '',
  socialStudiesFact: '',
  links: [],
  status: true,
  isFeatured: false,
}
@Component({
  selector: 'app-edit-lesson-modal',
  templateUrl: './edit-lesson-modal.component.html',
  styleUrls: ['./edit-lesson-modal.component.scss']
})
export class EditLessonModalComponent implements OnInit {
  @Input() previousStepName;
  lessonData: any;
  editor = ClassicEditor;
  ingredientForm: FormGroup;
  techniqueForm: FormGroup;
  descriptionForm: FormGroup;
  cookingForm: FormGroup;
  servingForm: FormGroup;
  cleanupForm: FormGroup;
  preprationForm: FormGroup;
  tabs = {
    BASIC_TAB: 0,
    RECIPES_TAB: 1,
    EXPERIMENT_TAB: 2,
    EXPERIMENT_QUE_TAB: 3,
    QUESTION_TAB: 4,
    ACTIVITY_TAB: 5,
    PREPARATION_TAB: 6,
    COOKINGSTEP_TAB: 7,
    SERVING_TAB: 8,
    INGREDIENT_TAB: 9,
    TECHNIQUE_TAB: 10,
    CLEANUP_TAB: 11,
    SENSORY_TAB:12,
    REFERENCE_LINK_TAB:13
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => recpes | 2 => preparation
  lesson;
  id: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  languageMaster: any = [];
  subjectMaster: any = [];
  gradeMaster = []
  safetyLevelMaster: any = [];
  previous: any;
  dataFromApi;
  systemLanguageMaster = [];
  refId: any;

  constructor(
    private lessonService: ManageLessonsService,
    private fb: FormBuilder,
    public standardService: ManageStandardsService,
    public ingredientsService: ManageIngredientsService,
    public countriesService: ManageCountriesService,
    private route: ActivatedRoute,
    private router: Router,
    private toast:ToastrService

  ) {
    // call all constant data form repective points
    this.loadServingForm();
    this.loadCookingForm();
    this.loadPreparationForm();
    this.loadIngredientForm();
    this.loadTechniqueForm();
    this.loadCleanupStepsForm()
    
  }

  ngOnInit(): void {
    this.isLoading$ = this.lessonService.isLoading$;
    this.lessonService._getlessonData$.subscribe(dt => this.lessonData = dt ? dt : undefined)
    this.route.params.subscribe(res => this.id = res ? res.id : undefined);
    this.refId = this.lessonData.referenceId ? this.lessonData.referenceId : this.lessonData.id
    if (this.refId) {
      this.lessonService.getLanguageListByFilter('lessons', this.refId).subscribe((res) => {
        this.systemLanguageMaster = res.data;
      }, (e) => {
        console.log(e)
      })
    } else {
      this.loadLanguage()
    }
    this.route.queryParams.subscribe(q => { if (q && q.nextStep) { this.activeTabId = Number(q.nextStep) } });
    this.loadMasters();
    this.loadLesson();
  }

  // Load system languages
  loadLanguage() {
    this.lessonService.getLanguageList().subscribe((res) => {
      this.systemLanguageMaster = res.data;
    }, (e) => {
      console.log(e)
    })
  }

  loadMasters() {
    const sb = this.lessonService.loadMasters().pipe(
      first(),
      catchError((errorMessage) => {
        console.log(errorMessage)
        return of(EMPTY_LESSON);
      })
    ).subscribe((response: any) => {
      this.gradeMaster = response?.[0].data;
      this.languageMaster = response?.[1].data
    });
    this.subscriptions.push(sb);

  }

  // check weather id is available if available then call get api and field form otherwise show empty field form
  loadLesson() {
    if (!this.id) {
      this.lesson = EMPTY_LESSON;
      this.loadForm();
    } else {
      const sb = this.lessonService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          // this.modal.dismiss(errorMessage);
          return of(EMPTY_LESSON);
        })
      ).subscribe((lesson: any) => {
        this.dataFromApi = lesson.data;
        this.lesson = lesson.data;
        //    this.lesson.reviewer=["vxc"]
        //    this.lesson.isReviewed=false
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }


  // create a form fields

  loadForm() {
    this.formGroup = this.fb.group({
      lessonTitle: [this.lesson.lessonTitle, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      learningObjForTeacher: [this.lesson.learningObjectivesForTeacher, Validators.compose([Validators.required])],
      learningObjForStudent: [this.lesson.learningObjectivesForStudent, Validators.compose([Validators.required])],
      greetingTrack: [this.lesson.greetingTrack],
      greeting: [this.lesson.greeting, Validators.compose([Validators.required])],
      linguisticDetails: [this.lesson.linguistic],
      learningObjectivesForStudentTrack: [this.lesson.learningObjectivesForStudentTrack],
      learningObjectivesForTeacherTrack: [this.lesson.learningObjectivesForTeacherTrack],
      status: [this.lesson.status],
      storyTime: [this.lesson.storyTime, Validators.compose([Validators.required])],
      isFeatured: [this.lesson.isFeatured],
      grade: [this.lesson.grade?.id, Validators.compose([Validators.required])],
      funFact: [this.lesson.funFact, Validators.compose([Validators.required])],
      socialStudiesFact: [this.lesson.socialStudiesFact, Validators.compose([Validators.required])],
      chefIntroduction: this.fb.array([]),
      teacherInstruction: this.fb.array([]),
      safteySteps: this.fb.array([]),
      safetyStepsTrack: [this.lesson.safetyStepsTrack],
      goodbye: [this.lesson.goodbye, Validators.compose([Validators.required])],
      goodbyeLinguistic: [this.lesson.goodbyeLinguistic],
      goodbyeTrack: [this.lesson.goodbyeTrack],
      languageId: [this.lesson.systemLanguageId]
      //  links: this.fb.array([])
    });
    /*  if (this.lesson?.links.length > 0) {
       this.lesson.links.forEach(e => {
         this.addQuantity(e);
       })
     } else {
       this.addQuantity(undefined)
     } */

  }


  // initalize preparation form group
  loadPreparationForm() {
    this.preprationForm = this.fb.group({
      preparationSteps: this.fb.array([])
    })
  }

  // initalize cooking form group
  loadCookingForm() {
    this.cookingForm = this.fb.group({
      cookingSteps: this.fb.array([])
    })
  }


  // initalize serving form
  loadServingForm() {
    this.servingForm = this.fb.group({
      servingSteps: this.fb.array([])
    })
  }
  // initalize cooking form group
  loadCleanupStepsForm() {
    this.cleanupForm = this.fb.group({
      cleanupSteps: this.fb.array([])
    })
  }

  loadIngredientForm() {
    this.ingredientForm = this.fb.group({
      ingredients: [],
      recipeIngredients: this.fb.array([])
    })
  }

  loadTechniqueForm() {
    this.techniqueForm = this.fb.group({
      techniques: [],
      recipeTechniques: this.fb.array([])
    })
  }

  // load link as a form array 
  linkNames(): FormArray {
    return this.formGroup.get("links") as FormArray
  }

  // create a link function pushed the group in link form array
  addQuantity(link) {
    this.linkNames().push(this.newLinkName(link));
  }

  // form froup of link array methods
  newLinkName(linkData): FormGroup {
    if (linkData == undefined) {
      return this.fb.group({
        videoLink: [linkData, Validators.required],
      })
    }
    return this.fb.group({
      id: [linkData.id],
      videoLink: [linkData.videoLink],
    })
  }

  // remove link using a index
  removeQuantity(i: number) {
    this.linkNames().removeAt(i);
  }

  // tab changed value
  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  // save form or we can create a new lessons
  save() {

    this.prepareLesson();
    if (this.lesson.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  // update lessons basics steps form details
  edit() {
    this.dataFromApi = this.lesson;
    this.dataFromApi.recipe = null;
    this.dataFromApi.elaQuestions = null;
    this.dataFromApi.mathQuestions = null;
    this.dataFromApi.ngssQuestions = null;
    this.dataFromApi.ncssQuestions = null;
    this.dataFromApi.experiment = null;
    this.dataFromApi.multiSensoryQuestions=null;
    this.dataFromApi.activity=null;
    this.dataFromApi.questions=null;

    const sbUpdate = this.lessonService.update(this.dataFromApi).pipe(
      tap(() => {
        this.loadLesson();
        this.changeTab(this.tabs.RECIPES_TAB);
      }),
      catchError((errorMessage) => {
        return of(this.lesson);
      }),
    ).subscribe(res => this.lesson = res);
    this.subscriptions.push(sbUpdate);
  }

  // create a new lessions of basic steps
  create() {
    const sbCreate = this.lessonService.create(this.lesson).pipe(
      tap((res: any) => {
        if(res.status==200){
          this.toast.success(res.message,"Success");
          this.router.navigate(['manage-lessons/old/', res.data.id], { queryParams: { nextStep: this.tabs.RECIPES_TAB } });
        }
        else if(res.status==409){
          this.toast.error(res.message,"Error");
        }
        else{
          this.toast.error("Something went wrong","Error");
        }
      }),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.lesson);
      }),
    ).subscribe((res: Lesson) => this.lesson = res as Lesson);
    this.subscriptions.push(sbCreate);
  }

  // prepare a data which we used in form
  private prepareLesson() {
    const formData = this.formGroup.value;
    this.lesson.lessonTitle = formData.lessonTitle;
    this.lesson.createrName = formData.createrName;
    this.lesson.reviewerName = formData.reviewerName;
    this.lesson.learningObjectivesForTeacher = formData.learningObjForTeacher;
    this.lesson.learningObjectivesForStudent = formData.learningObjForStudent;
    this.lesson.learningObjectivesForStudentTrack=formData.learningObjectivesForStudentTrack;
    this.lesson.learningObjectivesForTeacherTrack=formData.learningObjectivesForTeacherTrack;
    this.lesson.greeting = formData.greeting;
    this.lesson.linguistic = formData.linguisticDetails;
    this.lesson.greetingTrack = formData.greetingTrack;
    this.lesson.goodbye = formData.goodbye;
    this.lesson.goodbyeLinguistic = formData.goodbyeLinguistic;
    this.lesson.goodbyeTrack = formData.goodbyeTrack;
    this.lesson.chefIntroductions = formData.chefIntroduction;
    this.lesson.teacherInstructions = formData.teacherInstruction;
    this.lesson.isFeatured = formData.isFeatured;
    this.lesson.storyTime = formData.storyTime;
    this.lesson.status = formData.status;
    this.lesson.safetySteps = formData.safteySteps;
    this.lesson.safetyStepsTrack=formData.safetyStepsTrack;
  //  this.lesson.languageId = formData.language;
    this.lesson.gradeId = formData.grade;
 // this.lesson.multiSensoryActivity = formData.multiSenserActivity;
    this.lesson.funFact = formData.funFact,
    this.lesson.socialStudiesFact = formData.socialStudiesFact,
    this.lesson.links = formData.links;
    this.lesson.systemLanguageId=formData.languageId;
    this.lesson.referenceId=this.refId;
  
  }

  uploadGreetingTrack(event) {
    if (event.target.files && event.target.files.length == 1) {
      const sbCreate = this.lessonService.audioUpload(event.target.files).pipe().subscribe((res: any) => {
        this.formGroup.controls['greetingTrack'].patchValue(res.data[0].mediaPath)
      });
      this.subscriptions.push(sbCreate);
    }
  }
  
  removeGreetingTrack(){
    this.formGroup.controls['greetingTrack'].patchValue('')
  }

  uploadGoodbyeTrack(event) {
    if (event.target.files && event.target.files.length == 1) {
      const sbCreate = this.lessonService.audioUpload(event.target.files).pipe().subscribe((res: any) => {
        this.formGroup.controls['goodbyeTrack'].patchValue(res.data[0].mediaPath)
      });
      this.subscriptions.push(sbCreate);
    }
  }

  uploadLearningObjectiveTrack(event,fieldName){
    if (event.target.files && event.target.files.length == 1) {
      const sbCreate = this.lessonService.audioUpload(event.target.files).pipe().subscribe((res: any) => {
        this.formGroup.controls[fieldName].patchValue(res.data[0].mediaPath)
      });
      this.subscriptions.push(sbCreate);
    }
  }

  removeLearningObjectiveTrack(fieldName){
    this.formGroup.controls[fieldName].patchValue('');
  }

  removeGoodbyeTrack(){
    this.formGroup.controls['goodbyeTrack'].patchValue('');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }



  // validation functions

  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }

}
