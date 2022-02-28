import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel, ConfirmPasswordValidator } from '../../auth';
import { AuthService } from '../../auth/_services/auth.service';
import {  Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  user: UserModel;
  firstUserState: UserModel;
  subscriptions: Subscription[] = [];
  isLoading$: Observable<boolean>;

  constructor(private userService: AuthService, private fb: FormBuilder, private router: Router,private toast:ToastrService) {
    this.isLoading$ = this.userService.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    const sb = this.userService.currentUserSubject.asObservable().pipe(
      first(user => !!user)
    ).subscribe(user => {
      this.user = Object.assign({}, user);
      this.firstUserState = Object.assign({}, user);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  loadForm() {
    this.formGroup = this.fb.group({
      currentPassword: [this.user.password, Validators.required],
      password: ['', Validators.required],
      cPassword: ['', Validators.required]
    }, {
      validator: ConfirmPasswordValidator.MatchPassword
    });
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    this.user.password = this.formGroup.value.password;
    this.userService.isLoadingSubject.next(true);
    this.userService.changePassword({
      old_password: this.formGroup.value.currentPassword,
      new_password: this.formGroup.value.password
    }).subscribe(
      (data) => {
        this.userService.isLoadingSubject.next(false);
        if (data) {
          this.userService.currentUserSubject.next(Object.assign({}, this.user));
          this.toast.success(' Password changed successfully', 'Success');
          this.userService.logout();
        }
      },
      (error) => {
        if(error.status==403){
          this.toast.error("Current password doesn't match!", 'Error');
          this.userService.isLoadingSubject.next(false);
        }
      }
    );
  }

  cancel() {
    this.user = Object.assign({}, this.firstUserState);
    this.loadForm();
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
