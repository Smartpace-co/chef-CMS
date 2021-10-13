import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageSchoolRoutingModule } from './manage-school-routing.module';
import { ManageSchoolComponent } from './manage-school.component';
import { EditSchoolModalComponent } from './components/edit-school-modal/edit-school-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';


@NgModule({
  declarations: [ManageSchoolComponent, EditSchoolModalComponent],
  imports: [
    CommonModule,
    ManageSchoolRoutingModule,
    CommonModules
  ]
})
export class ManageSchool { }
