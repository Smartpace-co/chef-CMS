import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageDiscussionForumRoutingModule } from './manage-discussion-forum-routing.module';

import { EditDiscussionForumModalComponent } from './components/edit-discussion-forum-modal/edit-discussion-forum-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';
import { ManageDiscussionForumComponent } from './manage-discussion-forum.component';

@NgModule({
  declarations: [ManageDiscussionForumComponent,EditDiscussionForumModalComponent],
  imports: [
    CommonModule,
    ManageDiscussionForumRoutingModule,
    CommonModules
  ]
})
export class ManageDiscussionForum { }
