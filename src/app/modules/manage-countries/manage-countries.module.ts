import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCountriesRoutingModule } from './manage-countries-routing.module';
import { ManageCountriesComponent } from './manage-countries.component';
import { EditCountriesComponent } from './components/edit-countries/edit-countries.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';


@NgModule({
  declarations: [ManageCountriesComponent, EditCountriesComponent],
  imports: [
    CommonModule,
    ManageCountriesRoutingModule,
    CommonModules
  ]
})
export class ManageCountriesModule { }
