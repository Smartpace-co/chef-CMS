import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageExternalUsersComponent } from './manage-external-users.component';

const routes: Routes = [
  {
    path: '', component: ManageExternalUsersComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageUsersRoutingModule { }
