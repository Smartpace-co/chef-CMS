import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageNutrientsComponent } from './manage-nutrients.component';

const routes: Routes = [
  {
    path: '', component: ManageNutrientsComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageNutrientsRoutingModule { }
