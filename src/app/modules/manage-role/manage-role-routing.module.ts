import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoleComponent } from './manage-role.component';
import { UpdateRoleComponent } from './components/update-role/update-role.component';

const routes: Routes = [
  {
    path: '', component: ManageRoleComponent
  },
  {
    path: 'edit', component: UpdateRoleComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRoleRoutingModule { }