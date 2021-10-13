import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageDistrictAdminComponent } from './manage-districtAdmin.component';

const routes: Routes = [
  {
    path: '', component: ManageDistrictAdminComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageDistrictAdminRoutingModule { }
