
import { Injectable, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})

export class FormValidationServices {
  formGroupDef: FormGroup;
  // helpers for View
  constructor() { }

  isControlValid(controlName: string): boolean {
    const control = this.formGroupDef.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroupDef.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroupDef.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroupDef.controls[controlName];
    return control.dirty || control.touched;
  }

}
