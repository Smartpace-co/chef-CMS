import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSubscriptionPkgComponent } from './manage-subscription-pkgs.component';
import { ManageSubscriptionPkgRoutingModule } from './manage-subscription-pkgs-routing.module';
import { UpdateSubscriptionPkgComponent } from './components/update-subscription-pkg/update-subscription-pkg.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';
import { UpdateRoleStatusModalComponent } from './components/update-subscription-pkg-status-modal/update-role-status-modal.component';



@NgModule({
  declarations: [ManageSubscriptionPkgComponent, UpdateSubscriptionPkgComponent, UpdateRoleStatusModalComponent],
  imports: [
    CommonModule,
    ManageSubscriptionPkgRoutingModule,
    CommonModules
  ]
})
export class ManageSubscriptionPkgModule { }
