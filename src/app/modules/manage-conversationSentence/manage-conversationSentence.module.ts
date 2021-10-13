import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageConversationSentenceRoutingModule } from './manage-conversationSentence-routing.module';
import { ManageConversationSentenceComponent } from './manage-conversationSentence.component';
import { EditConversationSentenceModalComponent } from './components/edit-conversationSentence-modal/edit-conversationSentence-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';


@NgModule({
  declarations: [ManageConversationSentenceComponent, EditConversationSentenceModalComponent],
  imports: [
    CommonModule,
    ManageConversationSentenceRoutingModule,
    CommonModules
  ]
})
export class ManageConversationSentencesModule { }
