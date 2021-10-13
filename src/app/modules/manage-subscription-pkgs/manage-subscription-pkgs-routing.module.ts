import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageSubscriptionPkgComponent } from './manage-subscription-pkgs.component';
import { UpdateSubscriptionPkgComponent } from './components/update-subscription-pkg/update-subscription-pkg.component';

const routes: Routes = [
  {
    path: '', component: ManageSubscriptionPkgComponent
  },
  {
    path: 'edit', component: UpdateSubscriptionPkgComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageSubscriptionPkgRoutingModule { }