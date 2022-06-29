import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstLetterPipe } from './pipes/first-letter.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { FilterByPipe } from './pipes/filter-by.pipe';

@NgModule({
  declarations: [FirstLetterPipe, SafePipe, FilterByPipe],
  imports: [CommonModule],
  exports: [FirstLetterPipe, SafePipe, FilterByPipe],
})
export class CoreModule { }
