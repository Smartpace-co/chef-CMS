import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageDiscussionForumComponent } from './manage-discussion-forum.component';

const routes: Routes = [
  {
    path: '', component: ManageDiscussionForumComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageDiscussionForumRoutingModule { }
