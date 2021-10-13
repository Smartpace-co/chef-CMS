import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { SubjectServices } from '../../services/manage-subjects.service';
import { Subjects } from '../../_model/subject.model';
const EMPTY_SUBJECT: Subjects = {
  id: undefined,
  subjectTitle: '',
  status:true
}
@Component({
  selector: 'app-edit-subject-modal',
  templateUrl: './edit-subject-modal.component.html',
  styleUrls: ['./edit-subject-modal.component.scss']
})
export class EditSubjectModalComponent implements OnInit {
  @Input() id: number;
  @Input() refId: number;
  @Input() languageId: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  languageMaster=[];
  subject: any;
  formGroup: FormGroup;
  constructor(
    private subjectService: SubjectServices,
    private fb: FormBuilder, public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    private toast:ToastrService

  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.subjectService.isLoading$;
    if(this.refId){
      this.subjectService.getLanguageListByFilter('subjects',this.refId).subscribe((res)=>{
        this.languageMaster=res.data;
      },(e)=>{
        console.log(e)
      })
    }else{
      this.loadLanguage()
    }
    this.loadSubject();
    console.log(this.refId)
  }

   // Load system languages
   loadLanguage(){
    this.subjectService.getLanguageList().subscribe((res)=>{
      this.languageMaster=res.data;
    },(e)=>{
      console.log(e)
    })
  }

  loadSubject() {
    if (!this.id) {
      this.subject = {
        id: undefined,
        subjectTitle: '',
        status:true
      };
      this.loadForm();
    } else {
      const sb = this.subjectService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_SUBJECT);
        })
      ).subscribe((subject: any) => {
        this.subject = subject.data;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      subjectTitle: [this.subject.subjectTitle, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      languageId:[this.subject.systemLanguageId],
      status: [this.subject.status, Validators.compose([Validators.required])],
    });
  }

  save() {
    this.prepareCustomer();
    if (this.subject.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.subjectService.update(this.subject).pipe(
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
        return of(this.subject);
      }),
    ).subscribe(res => this.subject = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.subjectService.create(this.subject).pipe(
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
        return of(this.subject);
      }),
    ).subscribe((res: Subjects) => this.subject = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.subject.subjectTitle = formData.subjectTitle;
    this.subject.systemLanguageId=formData.languageId;
    this.subject.referenceId=this.refId;
    this.subject.status = formData.status;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
