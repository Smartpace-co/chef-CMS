import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageSubjectsComponent } from './manage-subjects.component';

const routes: Routes = [
  {
    path: '', component: ManageSubjectsComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageSubjectsRoutingModule { }
