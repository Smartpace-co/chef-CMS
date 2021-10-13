import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageIssuesFeedbackComponent } from './manage-issuesFeedback.component';

const routes: Routes = [
  {
    path: '', component: ManageIssuesFeedbackComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageIssuesFeedbackRoutingModule { }
