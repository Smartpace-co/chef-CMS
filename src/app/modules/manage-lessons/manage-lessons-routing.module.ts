import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditLessonModalComponent } from './components/edit-lesson-modal/edit-lesson-modal.component';
import { LessonDashboardComponent } from './components/lesson-dashboard/lesson-dashboard.component';
import { ManageLessonsComponent } from './manage-lessons.component';

const routes: Routes = [
  {
    path: '', component: LessonDashboardComponent
  },
  { path: 'lessons/:id', component: ManageLessonsComponent },
  { path: 'new', component: EditLessonModalComponent },
  { path: 'new/:id', component: EditLessonModalComponent },
  { path: 'old/:id', component: EditLessonModalComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageLessonsRoutingModule { }
