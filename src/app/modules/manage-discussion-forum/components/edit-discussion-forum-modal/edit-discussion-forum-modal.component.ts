import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageDiscussionForumService } from '../../services/manage-discussion-forum.service';

import { DiscussionForum } from '../../_model/discussionForum.model';

const EMPTY_CONVERSATION_SENTENCE: DiscussionForum = {
  id: undefined,
  userId:0,
  topic: '',
  description:'',
  status: true,
  isPinned:false
}
@Component({
  selector: 'app-edit-discussion-forum-modal',
  templateUrl: './edit-discussion-forum-modal.component.html',
  styleUrls: ['./edit-discussion-forum-modal.component.scss']
})
export class EditDiscussionForumModalComponent implements OnInit {
  @Input() id: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  discussionForum: DiscussionForum;
  formGroup: FormGroup;
  activateUserData: any;
  categoryMaster: any = [];
  constructor(
    private discussionForumService: ManageDiscussionForumService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    public toast : ToastrService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.discussionForumService.isLoading$;
    this.loadDiscussionForum();
  }
 

  loadDiscussionForum() {
    if (!this.id) {
      this.discussionForum = EMPTY_CONVERSATION_SENTENCE;
      this.loadNewForm();
    } else {
      const sb = this.discussionForumService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CONVERSATION_SENTENCE);
        })
      ).subscribe((discussionForum: any) => {
        this.discussionForum = discussionForum.data;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      topic: [this.discussionForum.topic, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      description: [this.discussionForum.description],
      status: [this.discussionForum.status, Validators.compose([Validators.required])],
      isPinned: [this.discussionForum.isPinned]
    });
  }
  loadNewForm() {

    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      topic: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      description: [''],
      status: [true, Validators.compose([Validators.required])],
      isPinned: [this.discussionForum.isPinned]
    });


  }

  save() {
    this.prepareCustomer();
    if (this.discussionForum.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.discussionForumService.update(this.discussionForum).pipe(
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
        return of(this.discussionForum);
      }),
    ).subscribe(res => this.discussionForum = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.discussionForumService.create(this.discussionForum).pipe(
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
        return of(this.discussionForum);
      }),
    ).subscribe((res: DiscussionForum) => this.discussionForum = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('v717demo1-authf649fc9a5f55'));
    const formData = this.formGroup.value;
    this.discussionForum.topic = formData.topic;
    this.discussionForum.description = formData.description;
    this.discussionForum.status = formData.status;
    this.discussionForum.userId =  this.activateUserData.id;
    this.discussionForum.isPinned=formData.isPinned;


  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
