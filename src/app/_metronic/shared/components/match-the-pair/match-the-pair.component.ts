import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidationServices } from '../../form-validation.service';
import { ManageStandardsService} from '../../../../modules/manage-standards/services/manage-standards.service'
import { of, Subscription } from 'rxjs';

const EMPTY_QUESTION:any  = {

  id: undefined,
  question: '',
  answerTypeId: "4",

  standard:[],
  image:'',
  hint:'',
  answers:[]
}
@Component({
  selector: 'app-match-the-pair',
  templateUrl: './match-the-pair.component.html',
  styleUrls: ['./match-the-pair.component.scss']
})
export class MatchThePairComponent implements OnInit {

  @Input() questionData: any;
  @Input() id: any;
  @Output() onCreate= new EventEmitter();
  @Output() onEdit = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  private subscriptions: Subscription[] = [];

  formGroup:FormGroup;
  questions:any;
  fileSizeError: boolean;
  fileHeight: any;
  fileWidth: any;
  fileResolutionError: boolean;
  images: any=[];
  standardMaster:any=[];
  moreImages:  boolean = true;
  isUploadDisabled: boolean;
;
  
  constructor(public validationService: FormValidationServices, private fb: FormBuilder,public standardsService:ManageStandardsService) {
    this.standardsService.fetch();
    this.standardsService.items$.subscribe(res => {
      this.standardMaster = res.filter(s => s.status === true);
    })
   }

  ngOnInit(): void {
   this.loadQuestion(undefined);
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
          answerType:['4',Validators.compose([])],
          standard: this.fb.array([]),
          hint:['',Validators.compose([])],
          pairImage:['',Validators.compose([])],
          answers: this.fb.array([]),
        })     
        this.addAnswers(undefined)

       } 
       else {
          this.questions = data;
          this.questions.standards=this.questions.standards.map(dt => dt.standards);

          this.validationService.formGroupDef = this.formGroup = this.fb.group({
            question: [this.questions.question, Validators.compose([Validators.required])],
            answerType: ["4", Validators.compose([Validators.required])],
            answers: this.fb.array([]),
            standard: [this.questions.standards]

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
    })
  }
    return this.fb.group({
      id:[data.id],
      option: [data.option,Validators.required],
      image: [data.image,Validators.required],
    })
  }

  uploadPairImage(){
    this.formGroup.get('hint').disable();
  }
  // remove link using a index
  removeQuantity(i: number) {
    this.answers().removeAt(i);
  }


  add() {
    this.prepareQuestion();
    this.onCreate.emit( this.questions);
    this.formGroup.reset();
  }
  edit(event) {
   this.id=event.id
   this.loadQuestion(event);
  }

  delete(event) {
    this.onDelete.emit(event);
  }

  changeHint(event){
    if(!event.target.value!=undefined){
      this.isUploadDisabled=true;
    }
  }

  prepareQuestion(){
    const formData = this.formGroup.value;

    this.questions.id?undefined:this.id;
    this.questions.question = formData.question;
    this.questions.answerTypeId= formData.answerType;
    this.questions.answers=formData.answers;
    this.questions.standards=formData.standard.map(dt => dt.id);
  }

  uploadImage(event,item) {
    console.log(item)
    if (event.target.files && event.target.files.length == 1) {
          const sbCreate= this.standardsService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
            item.controls['image'].patchValue(res.data[0].mediaPath)
          });
          this.subscriptions.push(sbCreate);
        }
  }

  removeImage(data){
  }
}
