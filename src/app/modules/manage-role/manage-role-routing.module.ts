import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoleComponent } from './manage-role.component';
import { RolesComponent } from './roles/roles.component';

const routes: Routes = [
    {
      path: 'list',
      component: ManageRoleComponent,
      // children: [
      //   // {
      //   //   path: 'users',
      //   //   component: UsersComponent,
      //   // },
      //   {
      //     path: 'list',
      //     component: RolesComponent,
      //   },
      //   { path: '', redirectTo: 'list', pathMatch: 'full' },
      //   { path: '**', redirectTo: 'list', pathMatch: 'full' },
      // ],
    },
    { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: '**', redirectTo: 'list', pathMatch: 'full' },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class ManageRoleRoutingModule {}