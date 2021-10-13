import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageDistrictAdminRoutingModule } from './manage-districtAdmin-routing.module';
import { ManageDistrictAdminComponent } from './manage-districtAdmin.component';
import { EditDistrictAdminModalComponent } from './components/edit-districtAdmin-modal/edit-districtAdmin-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';


@NgModule({
  declarations: [ManageDistrictAdminComponent, EditDistrictAdminModalComponent],
  imports: [
    CommonModule,
    ManageDistrictAdminRoutingModule,
    CommonModules
  ]
})
export class ManageDistrictAdmin { }
