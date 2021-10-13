import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { RolesService } from '../../services/roles.service';
import { Roles } from '../../_models/role.model';
import {ToastrService} from 'ngx-toastr'

const EMPTY_ROLE: Roles = {
  id: undefined,
  title: '',
  modulesORPages: '',
  status:true,
};

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.scss']
})
export class UpdateRoleComponent implements OnInit {
  @Input() id: number;
  isLoading$;
  roles: Roles;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    private toast:ToastrService
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.rolesService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.roles ={
        id: undefined,
        title: '',
        modulesORPages: '',
        status:true,
      };;
      this.loadForm();
    } else {
      const sb = this.rolesService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROLE);
        })
      ).subscribe((role: any) => {
        this.roles = role.data;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      title: [this.roles.title, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      status: [this.roles.status, Validators.compose([Validators.required])],
      modulesORPages: [this.roles.modulesORPages, Validators.compose([])],
    });
  
  }

  save() {
    this.prepareCustomer();
    if (this.roles.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.rolesService.update(this.roles).pipe(
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
        return of(this.roles);
      }),
    ).subscribe(res => this.roles = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.rolesService.create(this.roles).pipe(
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
        return of(this.roles);
      }),
    ).subscribe((res: Roles) => this.roles = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.roles.title = formData.title;
    this.roles.status = formData.status;
    this.roles.modulesORPages = formData.modulesORPages;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
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
