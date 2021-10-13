import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidationServices } from '../../form-validation.service';
import { ManageNutrientsService} from '../../../../modules/manage-nutrients/services/manage-nutrients.service'
import { of, Subscription } from 'rxjs';

const EMPTY_QUESTION:any  = {

  id: undefined,
  question: '',
  answers:[]
}
@Component({
  selector: 'app-spotlight-text',
  templateUrl: './spotlight-text.component.html',
  styleUrls: ['./spotlight-text.component.scss']
})
export class SpotlightTextComponent implements OnInit {

  @Input() questionData: any;
  @Input() id: any;
  @Output() onCreate= new EventEmitter();
  @Output() onEdit = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  private subscriptions: Subscription[] = [];

  formGroup:FormGroup;
  answerTypeMaster: any = [];
  questions:any;
  answerType: any;
  fileSizeError: boolean;
  fileHeight: any;
  fileWidth: any;
  fileResolutionError: boolean;
  images: any=[];
  moreImages:  boolean = true;;
  
  constructor(public validationService: FormValidationServices, private fb: FormBuilder,public tableService:ManageNutrientsService) {

   }

  ngOnInit(): void {
  this.loadMasters();
   this.loadQuestion(undefined);
  }

  loadMasters(){
   this.tableService.loadQuestionAndAnsType().subscribe((res:any)=>{
   //  this.answerTypeMaster=res?.[0].data;
     this.answerTypeMaster=res?.[1].data;
   },(e)=>{
     console.log(e.message)
   })
  }

  loadQuestion(data){
      if (!this.id) {
        this.questions = {
          id: undefined,
          question: '',
          answers:[]
        };
        this.validationService.formGroupDef = this.formGroup = this.fb.group({
          question: [this.questions.question, Validators.compose([Validators.required])],
          answerType: [null, Validators.compose([Validators.required])],
          answers: this.fb.array([]),
        })     
       } 
       else {
          this.answerType=data.answerTypeId;
          this.questions = data;
          this.validationService.formGroupDef = this.formGroup = this.fb.group({
            question: [this.questions.question, Validators.compose([Validators.required])],
            answerType: [this.questions.answerTypeId, Validators.compose([Validators.required])],
            answers: this.fb.array([]),
          }) 
          if (this.questions.answers.length > 0) {
            this.questions.answers.forEach(e => {
              this.addAnswers(e);
            })
          } else {
            this.addAnswers(undefined)
          }
      }
    
  }

  answers(): FormArray {
    return this.formGroup.get("answers") as FormArray
  }

  // create a link function pushed the group in link form array
  addAnswers(data) {
      this.answers().push(this.newLinkName(data));    
  }

  // form froup of link array methods
  newLinkName(data): FormGroup {
  if(data==undefined){
    return this.fb.group({
      option: [data,Validators.required],
      image: [data],
      isAnswer: [data,Validators.required]
    })
  }
    return this.fb.group({
      id:[data.id],
      option: [data.option,Validators.required],
      image: [data.image,Validators.required],
      isAnswer: [data.isAnswer,Validators.required]    
    })
  }

  // remove link using a index
  removeQuantity(i: number) {
    this.answers().removeAt(i);
  }


  add() {
    this.prepareQuestion();
    this.onCreate.emit( this.questions);
    this.formGroup.reset();
    this.answerType=null;
  }
  edit(event) {
   this.id=event.id
   this.loadQuestion(event);
  }

  delete(event) {
    this.onDelete.emit(event);
  }

  changeAnswerType(type) {
    this.answerType = type;
    let frmArray = this.formGroup.get('answers') as FormArray;
    frmArray.clear();    
    this.addAnswers(undefined)
  }

  prepareQuestion(){
    const formData = this.formGroup.value;

    this.questions.id?undefined:this.id;
    this.questions.question = formData.question;
    this.questions.answerTypeId= formData.answerType;
    this.questions.answers=formData.answers;
  }

  uploadImage(event,item) {
    console.log(item)
    if (event.target.files && event.target.files.length == 1) {
          const sbCreate= this.tableService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
            item.controls['image'].patchValue(res.data[0].mediaPath)
          });
          this.subscriptions.push(sbCreate);
        }
  }

  removeImage(data){
  }
}
