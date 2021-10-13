import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageStandardsComponent } from './manage-standards.component';

const routes: Routes = [
  {
    path: '', component: ManageStandardsComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageStandardsRoutingModule { }
