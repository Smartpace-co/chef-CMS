import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageStandardsRoutingModule } from './manage-standards-routing.module';
import { ManageStandardsComponent } from './manage-standards.component';
import { EditStandardsModalComponent } from './components/edit-standards-modal/edit-standards-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';


@NgModule({
  declarations: [ManageStandardsComponent, EditStandardsModalComponent],
  imports: [
    CommonModule,
    ManageStandardsRoutingModule,
    CommonModules
  ]
})
export class ManageStandardsModule { }
