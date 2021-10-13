import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageToolsRoutingModule } from './manage-tools-routing.module';
import { ManageToolsComponent } from './manage-tools.component';
import { EditToolsComponent } from './components/edit-tools/edit-tools.component';
import { DeleteToolsModalComponent } from './components/delete-tools-modal/delete-tools-modal.component';
import { DeleteToolModalComponent } from './components/delete-tool-modal/delete-tool-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';


@NgModule({
  declarations: [ManageToolsComponent,EditToolsComponent, DeleteToolsModalComponent, DeleteToolModalComponent],
  imports: [
    CommonModule,
    ManageToolsRoutingModule,
    CommonModules
  ]
})
export class ManageToolsModule { }
