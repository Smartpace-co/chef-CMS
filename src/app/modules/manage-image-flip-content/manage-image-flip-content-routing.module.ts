import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageImageFlipContentComponent } from './manage-image-flip-content.component';

const routes: Routes = [
  {
    path: '', component: ManageImageFlipContentComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageImageFlipContentRoutingModule { }
