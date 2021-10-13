import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageIssuesFeedbackService } from '../../services/manage-issuesFeedback.service';

import {IssuesFeedback } from '../../_model/issuesFeedback.model';

const EMPTY_ISSUES_FEEDBACK: IssuesFeedback = {
  id: undefined,
  comment:'',
  report_issue:{
    id:undefined,
    attachment:'',
    description:'',
    type:'',
    createdAt:'',
    school:{
      id:undefined,
     admin_account_name:''

    },
    district_admin:{
      id:undefined,
     admin_account_name:''

    }
}
}
@Component({
  selector: 'app-edit-issues-feedback-modal',
  templateUrl: './edit-issues-feedback-modal.component.html',
  styleUrls: ['./edit-issues-feedback-modal.component.scss']
})
export class EditIssuesFeedbackModalComponent implements OnInit {
  @Input() id: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  issuesFeedback: IssuesFeedback;
  reportMaster: any = [];
  formGroup: FormGroup;
  postedBy:any;
  constructor(
    private issuesFeedbackService: ManageIssuesFeedbackService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    private toast :ToastrService
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.issuesFeedbackService.isLoading$;
    this.loadIssuesFeedback();
  }
  
  loadIssuesFeedback() {
    if (!this.id) {
      this.issuesFeedback = EMPTY_ISSUES_FEEDBACK;
      this.loadForm();
    } else {
      const sb = this.issuesFeedbackService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ISSUES_FEEDBACK);
        })
      ).subscribe((issuesFeedback: any) => {
        this.issuesFeedback = issuesFeedback.data;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    if(this.issuesFeedback.report_issue.school)
{
  this.postedBy=this.issuesFeedback.report_issue.school.admin_account_name;
}
else
{
  this.postedBy=this.issuesFeedback.report_issue.district_admin.admin_account_name
}
    this.formGroup = this.fb.group({
      comment: [this.issuesFeedback.comment, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      description: [this.issuesFeedback.report_issue.description],
      type: [this.issuesFeedback.report_issue.type],
      //createdAt: [this.issuesFeedback.report_issue.createdAt],
      postedBy: [this.postedBy],
      //createdAt : this.issuesFeedback.report_issue.createdAt.toDateString();

    });
  }

  save() {
    this.prepareCustomer();
    if (this.issuesFeedback.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.issuesFeedbackService.update(this.issuesFeedback).pipe(
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
        return of(this.issuesFeedback);
      }),
    ).subscribe(res => this.issuesFeedback = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.issuesFeedbackService.create(this.issuesFeedback).pipe(
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
        return of(this.issuesFeedback);
      }),
    ).subscribe((res: IssuesFeedback) => this.issuesFeedback = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    if(this.issuesFeedback.report_issue.school)
    {
      this.postedBy=this.issuesFeedback.report_issue.school.admin_account_name;
    }
    else
    {
      this.postedBy=this.issuesFeedback.report_issue.district_admin.admin_account_name
    }
    const formData = this.formGroup.value;
    this.issuesFeedback.comment = formData.comment;
    this.issuesFeedback.report_issue.description = formData.description;
    this.issuesFeedback.report_issue.type = formData.type;
    //this.issuesFeedback.report_issue.createdAt = formData.createdAt;
    if(this.issuesFeedback.report_issue.school)
    {
    this.issuesFeedback.report_issue.school.admin_account_name = this.postedBy;
    }
    else
    {
      this.issuesFeedback.report_issue.district_admin.admin_account_name = this.postedBy;

    }

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
