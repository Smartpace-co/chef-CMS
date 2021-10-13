import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageNutrientsRoutingModule } from './manage-nutrients-routing.module';
import { ManageNutrientsComponent } from './manage-nutrients.component';
import { EditNutrientsModalComponent } from './components/edit-nutrients-modal/edit-nutrients-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';


@NgModule({
  declarations: [ManageNutrientsComponent, EditNutrientsModalComponent],
  imports: [
    CommonModule,
    ManageNutrientsRoutingModule,
    CommonModules
  ]
})
export class ManageNutrientsModule { }
