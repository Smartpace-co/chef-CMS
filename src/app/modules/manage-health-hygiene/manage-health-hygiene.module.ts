import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageHealthHygieneRoutingModule } from './manage-health-hygiene-routing.module';

import { EditHealthHygieneModalComponent } from './components/edit-health-hygiene-modal/edit-health-hygiene-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';
import { ManageHealthHygieneComponent } from './manage-health-hygiene.component';

@NgModule({
  declarations: [ManageHealthHygieneComponent,EditHealthHygieneModalComponent],
  imports: [
    CommonModule,
    ManageHealthHygieneRoutingModule,
    CommonModules
  ]
})
export class ManageHealthHygieneModule { }
