import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageUsersRoutingModule } from './manage-users-routing.module';
import { ManageUsersComponent } from './manage-users.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';
import { EditUserModalComponent } from './components/edit-user-modal/edit-user-modal.component';
import { UpdateUsersStatusModalComponent } from './components/update-users-status-modal/update-users-status-modal.component';


@NgModule({
  declarations: [ManageUsersComponent, EditUserModalComponent, UpdateUsersStatusModalComponent],
  imports: [
    CommonModule,
    ManageUsersRoutingModule,
    CommonModules
  ]
})
export class ManageUsersModule { }
