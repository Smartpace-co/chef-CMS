import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-description-fields',
  templateUrl: './description-fields.component.html',
  styleUrls: ['./description-fields.component.scss']
})
export class DescriptionFieldsComponent implements OnInit {
  @Input() fieldControler;
  @Input() lessonId;
  @Input() form;
  @Input() id: number;
  formGroup: FormGroup;
  @Input() fieldValues;
  desLevelMaster = [{ name: 'easy', value: 'easy 1st and 2nd grade' },
  { name: 'medium', value: 'medium-3rd and 4th grade' }, { name: 'hard', value: 'hard-5th and 6th grade' }]
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.loadForm()
  }

  loadForm() {
    if (this.fieldValues && this.fieldValues.length > 0) {
      this.fieldValues.forEach(e => this.addQuantity(e));
    }else{
      this.addQuantity(this.fieldValues);
    }
  }

  descriptionInfo(): FormArray {
    return this.form.get(`${this.fieldControler}`) as FormArray
  }

  addQuantity(data) {
    if (this.descriptionInfo().controls.length > 3) {
      window.alert('You can Add Maximum 3 Description');
      return;
    } else {

      this.descriptionInfo().push(this.newDescriptionTitle(data));
    }
  }

  newDescriptionTitle(data) {
    return this.fb.group({
      level: [data?.level],
      text: [data?.text]
    });

  }

  removeQuantity(i: number) {
    this.descriptionInfo().removeAt(i);
  }


}
