import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit, OnDestroy {
  @Input() form;
  @Input() fieldControl;
  @Input() labelName;
  @Input() fieldValues;
  editor = ClassicEditor;
  formGroup: FormGroup;
  public Editor = ClassicEditor;  
  config = {
    autoGrow_maxHeight: 300
  }
  constructor(
    private fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.loadForm();
  }


  loadForm() {
    const fieldsArray = this.form.get(`${this.fieldControl}`) as FormArray;
    fieldsArray.clear();
    if (this.fieldValues && this.fieldValues.length > 0) {
      this.fieldValues.forEach(e => this.addQuantity(e));
    } else {
      this.addQuantity(this.fieldValues);
    }
  }

  ngOnDestroy() {
    this.fieldValues = undefined;
    this.fieldControl = undefined;
  }

  chefIntroductionInfo(): FormArray {
    return this.form.get(`${this.fieldControl}`) as FormArray
  }

  addQuantity(data) {
    this.chefIntroductionInfo().push(this.newChefIntroductionItems(data));
  }

  public onChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
}

  newChefIntroductionItems(data): FormGroup {
    if(data==undefined){
      return this.fb.group({
        text: [data,Validators.required],
      })
    }
    else{
      return this.fb.group({
        id:[data.id],
        text: [data.text,Validators.required],
      })
    }
      
  }

  removeQuantity(i: number) {
    this.chefIntroductionInfo().removeAt(i);
  }

}
