import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../crud-table';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectInputComponent } from '../components/ng-select-input/ng-select-input.component';
import { UploadButtonComponent } from '../components/upload-button/upload-button.component'
import { SpotlightTextComponent } from '../components/spotlight-text/spotlight-text.component'
import { MatchThePairComponent } from '../components/match-the-pair/match-the-pair.component'
import { ToastrModule} from 'ngx-toastr'
import { TagInputModule } from 'ngx-chips';


@NgModule({
  declarations: [
    NgSelectInputComponent,
    UploadButtonComponent,
    SpotlightTextComponent,
    MatchThePairComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    NgSelectModule,
    TagInputModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 7000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })

  ],
  exports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    NgSelectModule,
    NgMultiSelectDropDownModule,
    TagInputModule,
    NgSelectInputComponent,
    UploadButtonComponent,
    SpotlightTextComponent,
    MatchThePairComponent,
    ToastrModule
  ]
})
export class CommonModules { }
