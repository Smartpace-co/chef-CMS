import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-ng-select-input',
  templateUrl: './ng-select-input.component.html',
  styleUrls: ['./ng-select-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgSelectInputComponent),
      multi: true
    }
  ]
})
export class NgSelectInputComponent implements OnInit {
  @Input() fieldControl;
  @Input() dataList;
  @Input() placeHolder;
  @Input() formName;
  @Input() idfield;
  @Input() textField;

  @Output() onSelect = new EventEmitter();
  @Output() onDeSelectItem= new EventEmitter();
  @Output() onSelectAllItem = new EventEmitter();

  data = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {}

  constructor() { }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: this.idfield ? this.idfield : 'id',
      textField: this.textField ? this.textField : 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit:4,
      allowSearchFilter: true
    }
  }



  onItemSelect(item: any) {
    this.onSelect.emit(item)
  }
  onSelectAll(items: any) {
    this.onSelectAllItem.emit(items)
  }

  onDeselect(item:any){
    this.onDeSelectItem.emit(item)
  }
}
