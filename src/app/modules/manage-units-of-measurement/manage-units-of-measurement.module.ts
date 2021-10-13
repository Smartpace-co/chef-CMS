import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageUnitsOfMeasurementRoutingModule } from './manage-units-of-measurement-routing.module';
import { ManageUnitsOfMeasurementComponent } from './manage-units-of-measurement.component';
import { EditUnitsOfMeasurementModalComponent } from './components/edit-units-of-measurement-modal/edit-units-of-measurement-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';


@NgModule({
  declarations: [ManageUnitsOfMeasurementComponent, EditUnitsOfMeasurementModalComponent,],
  imports: [
    CommonModule,
    ManageUnitsOfMeasurementRoutingModule,
    CommonModules
  ]
})
export class ManageUnitsOfMeasurementModule { }
