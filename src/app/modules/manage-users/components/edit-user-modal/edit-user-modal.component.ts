import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { RolesService } from 'src/app/modules/manage-role/services/roles.service';
import { User } from 'src/app/modules/manage-users/_models/user.model';
import { UtilityService } from 'src/app/_metronic/core/utils/utility.service';
import { CustomRegex } from 'src/app/_metronic/shared/custom-regex';
import { UsersService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr'

const EMPTY_USER: User = {
  id: undefined,
  name: '',
  email: '',
  phoneNumber: null,
  roleId: null,
  status: true
};
@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent implements OnInit {
  @Input() id: number;
  isLoading$;
  customer: any;
  formGroup: FormGroup;
  rolesMaster: any = [];
  private subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private usersService: UsersService,
    public roleService: RolesService,
    private utiltiService: UtilityService,
    private toast: ToastrService
  ) {
    this.roleService.fetch();
    this.usersService.getRole().subscribe(res => {
      this.rolesMaster = res.data.filter(s => s.status === true)
    })
  }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;
    this.loadUser();
  }

  loadUser() {
    if (!this.id) {
      this.customer =  {
        id: undefined,
        name: '',
        email: '',
        phoneNumber: null,
        roleId: null,
        status: true
      };
      this.loadForm();
    } else {
      const sb = this.usersService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_USER);
        })
      ).subscribe((customer: any) => {
        this.customer = customer.data;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }


  /**
   * Format the phone number into :(000)-000-0000
   * @param data 
   */
  formatNumber(data) {
    this.formGroup.get('phoneNumber').setValue(this.utiltiService.formatPhoneNumber(data));
  }


  loadForm() {
    this.formGroup = this.fb.group({
      name: [this.customer.name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      email: [this.customer.email, Validators.compose([Validators.required, Validators.email])],
      role: [this.customer.role?.id, Validators.compose([Validators.required])],
      phoneNumber: [this.customer.phoneNumber, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(14)])],
      status: [this.customer.status, Validators.required]
    });
  }


  save() {
    this.prepareCustomer();
    if (this.customer.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.usersService.update(this.customer).pipe(
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
        this.toast.error("Something Wrong", "Error")
        this.modal.dismiss(errorMessage);
        return of(this.customer);
      }),
    ).subscribe(res => {
      
        this.customer = res
    })

    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.usersService.create(this.customer).pipe(
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
        this.toast.error("Something Wrong", "Error")
        this.modal.dismiss(errorMessage);
        return of(this.customer);
      }),
    ).subscribe((res: any) => {
        this.customer = res
    });
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.customer.email = formData.email;
    this.customer.name = formData.name;
    this.customer.roleId = formData.role;
    this.customer.phoneNumber = formData.phoneNumber;
    this.customer.status = formData.status;
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
