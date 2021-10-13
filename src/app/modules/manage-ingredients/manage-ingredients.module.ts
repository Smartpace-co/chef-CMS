import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageIngredientsRoutingModule } from './manage-ingredients-routing.module';
import { ManageIngredientsComponent } from './manage-ingredients.component';
import { EditIngredientsModalComponent } from './components/edit-ingredients-modal/edit-ingredients-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';


@NgModule({
  declarations: [ManageIngredientsComponent, EditIngredientsModalComponent],
  imports: [
    CommonModule,
    ManageIngredientsRoutingModule,
    CommonModules
  ]
})
export class ManageIngredientsModule { }
