import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageUsersRoutingModule } from './manage-external-users-routing.module';
import { ManageExternalUsersComponent } from './manage-external-users.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';

@NgModule({
  declarations: [ManageExternalUsersComponent],
  imports: [
    CommonModule,
    ManageUsersRoutingModule,
    CommonModules
  ]
})
export class ManageExternalUsersModule { }
