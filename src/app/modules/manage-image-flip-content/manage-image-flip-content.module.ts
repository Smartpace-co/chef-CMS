import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageImageFlipContentRoutingModule } from './manage-image-flip-content-routing.module';
import { ManageImageFlipContentComponent } from './manage-image-flip-content.component';
import { EditImageFlipContentModalComponent } from './components/edit-image-flip-content-modal/edit-image-flip-content-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';


@NgModule({
  declarations: [ManageImageFlipContentComponent, EditImageFlipContentModalComponent],
  imports: [
    CommonModule,
    ManageImageFlipContentRoutingModule,
    CommonModules
  ]
})
export class ManageImageFlipContentModule { }
