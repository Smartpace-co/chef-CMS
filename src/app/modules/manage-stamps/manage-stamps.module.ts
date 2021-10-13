import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageStampsRoutingModule } from './manage-stamps-routing.module';
import { ManageStampsComponent } from './manage-stamps.component';
import { EditStampsComponent } from './components/edit-stamps/edit-stamps.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';


@NgModule({
  declarations: [ManageStampsComponent, EditStampsComponent],
  imports: [
    CommonModule,
    ManageStampsRoutingModule,
    CommonModules
  ]
})
export class ManageStampsModule { }
