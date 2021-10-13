import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageConversationSentenceComponent } from './manage-conversationSentence.component';

const routes: Routes = [
  {
    path: '', component: ManageConversationSentenceComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageConversationSentenceRoutingModule { }
