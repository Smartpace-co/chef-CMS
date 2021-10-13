import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageUnitsOfMeasurementComponent } from './manage-units-of-measurement.component';

const routes: Routes = [
  {
    path: '', component: ManageUnitsOfMeasurementComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageUnitsOfMeasurementRoutingModule { }
