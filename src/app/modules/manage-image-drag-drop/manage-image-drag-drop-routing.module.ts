import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageImageDragDropComponent } from './manage-image-drag-drop.component';

const routes: Routes = [
  {
    path: '', component: ManageImageDragDropComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageImageDragDropRoutingModule { }
