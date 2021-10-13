import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageImageDragDropRoutingModule } from './manage-image-drag-drop-routing.module';
import { ManageImageDragDropComponent } from './manage-image-drag-drop.component';
import { EditImageDragDropModalComponent } from './components/edit-image-drag-drop-modal/edit-image-drag-drop-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';


@NgModule({
  declarations: [ManageImageDragDropComponent, EditImageDragDropModalComponent],
  imports: [
    CommonModule,
    ManageImageDragDropRoutingModule,
    CommonModules
  ]
})
export class ManageImageDragDropModule { }
