import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageHealthHygieneComponent } from './manage-health-hygiene.component';

const routes: Routes = [
  {
    path: '', component: ManageHealthHygieneComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageHealthHygieneRoutingModule { }
