import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageRoleComponent } from './manage-role.component';
import { RolesComponent } from './roles/roles.component';
import { ManageRoleRoutingModule } from './manage-role-routing.module';



@NgModule({
  declarations: [ManageRoleComponent, RolesComponent],
  imports: [
    CommonModule,
    ManageRoleRoutingModule
  ]
})
export class ManageRoleModule { }
