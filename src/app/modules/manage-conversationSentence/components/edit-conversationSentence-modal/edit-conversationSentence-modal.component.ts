import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageConversationSentenceService } from '../../services/manage-conversationSentence.service';

import { ConversationSentences } from '../../_model/conversationSentence.model';

const EMPTY_CONVERSATION_SENTENCE: ConversationSentences = {
  id: undefined,
  conversationSentence: '',
  categoryId:'',
  status: true
}
@Component({
  selector: 'app-edit-conversationSentence-modal',
  templateUrl: './edit-conversationSentence-modal.component.html',
  styleUrls: ['./edit-conversationSentence-modal.component.scss']
})
export class EditConversationSentenceModalComponent implements OnInit {
  @Input() id: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  conversationSentence: ConversationSentences;
  formGroup: FormGroup;
  categoryMaster: any = [];
  constructor(
    private conversationSentenceService: ManageConversationSentenceService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    private toast : ToastrService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.conversationSentenceService.isLoading$;
    this.loadMasters();
    this.loadConversationSentence();
  }
  loadMasters(){
    const sb = this.conversationSentenceService.loadMasters().pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_CONVERSATION_SENTENCE);
      })
    ).subscribe((response: any) => {
      this.categoryMaster=response?.[0].data;
    });
    this.subscriptions.push(sb);
  
  }

  loadConversationSentence() {
    if (!this.id) {
      this.conversationSentence = EMPTY_CONVERSATION_SENTENCE;
      this.loadNewForm();

    } else {
      const sb = this.conversationSentenceService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CONVERSATION_SENTENCE);
        })
      ).subscribe((conversationSentence: any) => {
        this.conversationSentence = conversationSentence.data;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      conversationSentence: [this.conversationSentence.conversationSentence, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      status: [this.conversationSentence.status, Validators.compose([Validators.required])],
      category: [this.conversationSentence.categoryId, Validators.compose([Validators.required])],

    });
  }
  loadNewForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      conversationSentence: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      status: [true, Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],

    });
  }

  save() {
    this.prepareCustomer();
    if (this.conversationSentence.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.conversationSentenceService.update(this.conversationSentence).pipe(
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
        return of(this.conversationSentence);
      }),
    ).subscribe(res => this.conversationSentence = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.conversationSentenceService.create(this.conversationSentence).pipe(
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
        return of(this.conversationSentence);
      }),
    ).subscribe((res: ConversationSentences) => this.conversationSentence = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.conversationSentence.conversationSentence = formData.conversationSentence;
    this.conversationSentence.status = formData.status;
    this.conversationSentence.categoryId = formData.category;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
