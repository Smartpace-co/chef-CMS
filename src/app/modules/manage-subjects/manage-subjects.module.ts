import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageSubjectsRoutingModule } from './manage-subjects-routing.module';
import { ManageSubjectsComponent } from './manage-subjects.component';
import { EditSubjectModalComponent } from './components/edit-subject-modal/edit-subject-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';


@NgModule({
  declarations: [ManageSubjectsComponent, EditSubjectModalComponent],
  imports: [
    CommonModule,
    ManageSubjectsRoutingModule,
    CommonModules
  ]
})
export class ManageSubjectsModule { }
