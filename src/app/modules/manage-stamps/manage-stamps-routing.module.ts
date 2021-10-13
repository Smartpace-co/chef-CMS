import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageStampsComponent } from './manage-stamps.component';

const routes: Routes = [
  {
    path: '', component: ManageStampsComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageStampsRoutingModule { }
