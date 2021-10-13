import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageHealthHygieneService } from '../../services/manage-health-hygiene.service';

import { HealthHygiene } from '../../_model/healthHygiene.model';

const EMPTY_CONVERSATION_SENTENCE: HealthHygiene = {
  id: undefined,
  question: '',
  status: true
}
@Component({
  selector: 'app-edit-health-hygiene-modal',
  templateUrl: './edit-health-hygiene-modal.component.html',
  styleUrls: ['./edit-health-hygiene-modal.component.scss']
})
export class EditHealthHygieneModalComponent implements OnInit {
  @Input() id: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  healthHygiene: HealthHygiene;
  formGroup: FormGroup;
  categoryMaster: any = [];
  constructor(
    private healthHygieneService: ManageHealthHygieneService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    private toast :ToastrService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.healthHygieneService.isLoading$;
    this.loadHealthHygiene();
  }
 

  loadHealthHygiene() {
    if (!this.id) {
      this.healthHygiene = EMPTY_CONVERSATION_SENTENCE;
      this.loadNewForm();
    } else {
      const sb = this.healthHygieneService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CONVERSATION_SENTENCE);
        })
      ).subscribe((healthHygiene: any) => {
        this.healthHygiene = healthHygiene.data;
        this.loadForm();

      });
      this.subscriptions.push(sb);
    }
  }
  loadNewForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      question: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      status: [true, Validators.compose([Validators.required])],

    });
  }


  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      question: [this.healthHygiene.question, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      status: [this.healthHygiene.status, Validators.compose([Validators.required])],

    });
  }

  save() {
    this.prepareCustomer();
    if (this.healthHygiene.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.healthHygieneService.update(this.healthHygiene).pipe(
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
        return of(this.healthHygiene);
      }),
    ).subscribe(res => this.healthHygiene = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.healthHygieneService.create(this.healthHygiene).pipe(
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
        return of(this.healthHygiene);
      }),
    ).subscribe((res: HealthHygiene) => this.healthHygiene = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.healthHygiene.question = formData.question;
    this.healthHygiene.status = formData.status;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
