import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageRoleComponent } from './manage-role.component';
import { ManageRoleRoutingModule } from './manage-role-routing.module';
import { UpdateRoleComponent } from './components/update-role/update-role.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';
import { UpdateRoleStatusModalComponent } from './components/update-role-status-modal/update-role-status-modal.component';



@NgModule({
  declarations: [ManageRoleComponent, UpdateRoleComponent, UpdateRoleStatusModalComponent],
  imports: [
    CommonModule,
    ManageRoleRoutingModule,
    CommonModules
  ]
})
export class ManageRoleModule { }
