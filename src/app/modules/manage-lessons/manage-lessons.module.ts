import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageLessonsRoutingModule } from './manage-lessons-routing.module';
import { ManageLessonsComponent } from './manage-lessons.component';
import { CommonModules } from 'src/app/_metronic/shared/common/common.module';
import { EditLessonModalComponent } from './components/edit-lesson-modal/edit-lesson-modal.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { RecipsFormComponent } from './components/recips-form/recips-form.component';
import { ExperimentStepsFormComponent } from './components/experiment-steps-form/experiment-steps-form.component';
import { SharedFormComponent } from './shared-form/shared-form.component';
import { DescriptionFieldsComponent } from './description-fields/description-fields.component';
import { QuestionsFormComponent } from './components/questions-form/questions-form.component';
import { ActivityNameFormComponent } from './components/activity-name-form/activity-name-form.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { ExperimentQuestionFormComponent } from './components/experiment-question-form/experiment-question-form.component';
import { IngredientFormComponent } from './ingredient-form/ingredient-form.component';
import { TechniqueFormComponent } from './technique-form/technique-form.component';
import { LessonDashboardComponent } from './components/lesson-dashboard/lesson-dashboard.component';
import { SensoryQuestionFormComponent } from './components/sensory-question-form/sensory-question-form.component';
import { LinkFormComponent } from './components/link-form/link-form.component';

@NgModule({
  declarations: [
    ManageLessonsComponent,
    EditLessonModalComponent,
    RecipsFormComponent,
    ExperimentStepsFormComponent,
    SharedFormComponent,
    DescriptionFieldsComponent,
    QuestionsFormComponent,
    ActivityNameFormComponent,
    TextEditorComponent,
    ExperimentQuestionFormComponent,
    IngredientFormComponent,
    TechniqueFormComponent,
    LessonDashboardComponent,
    SensoryQuestionFormComponent,
    LinkFormComponent],
  imports: [
    CommonModule,
    ManageLessonsRoutingModule,
    CommonModules,
    CKEditorModule,
  ]
})
export class ManageLessonsModule { }
