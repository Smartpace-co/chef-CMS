import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageCulinaryTechniquesComponent } from './manage-culinary-techniques.component';

const routes: Routes = [
  {
    path: '', component: ManageCulinaryTechniquesComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCulinaryTechniquesRoutingModule { }
