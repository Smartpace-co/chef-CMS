import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageCulinaryTechniquesRoutingModule } from './manage-culinary-techniques-routing.module';
import { EditCulinaryTechniquesModalComponent } from './components/edit-culinary-techniques-modal/edit-culinary-techniques-modal.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';
import { ManageCulinaryTechniquesComponent } from './manage-culinary-techniques.component';


@NgModule({
  declarations: [ManageCulinaryTechniquesComponent,EditCulinaryTechniquesModalComponent],
  imports: [
    CommonModule,
    ManageCulinaryTechniquesRoutingModule,
    CommonModules
  ]
})
export class ManageCulinaryTechniquesModule { }
