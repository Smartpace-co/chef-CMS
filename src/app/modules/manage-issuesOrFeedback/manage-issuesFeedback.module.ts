import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageIssuesFeedbackRoutingModule } from './manage-issuesFeedback-routing.module';
import { ManageIssuesFeedbackComponent } from './manage-issuesFeedback.component';
import { EditIssuesFeedbackModalComponent } from './components/edit-issues-feedback-modal/edit-issues-feedback-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';


@NgModule({
  declarations: [ManageIssuesFeedbackComponent,EditIssuesFeedbackModalComponent],
  imports: [
    CommonModule,
    ManageIssuesFeedbackRoutingModule,
    CommonModules
  ]
})
export class ManageIssuesFeedbackModule { }
