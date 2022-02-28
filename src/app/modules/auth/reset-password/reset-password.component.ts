import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from '../registration/confirm-password.validator';
import { UserModel } from '../_models/user.model';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.resetForm.controls;
  }

  initForm() {
    this.resetForm = this.fb.group(
      {
        email: [
          'admin@demo.com',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            Validators.pattern('^([a-zA-Z0-9]+)$')
          ]),
        ],
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            Validators.pattern('^([a-zA-Z0-9]+)$')
          ]),
        ]
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  submit() {
    this.hasError = false;
    const result = {};
    Object.keys(this.f).forEach(key => {
      result[key] = this.f[key].value;
    });
    const resetPasswordSubscr = this.authService
      .resetPassword(result)
      .pipe(first())
      .subscribe((result: any) => {
        if (result) {
          this.router.navigate(['/']);
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(resetPasswordSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
