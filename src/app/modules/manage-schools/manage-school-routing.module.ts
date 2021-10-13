import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageSchoolComponent } from './manage-school.component';

const routes: Routes = [
  {
    path: '', component: ManageSchoolComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageSchoolRoutingModule { }
