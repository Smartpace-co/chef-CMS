import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageIngredientsComponent } from './manage-ingredients.component';

const routes: Routes = [
  {
    path: '', component: ManageIngredientsComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageIngredientsRoutingModule { }
