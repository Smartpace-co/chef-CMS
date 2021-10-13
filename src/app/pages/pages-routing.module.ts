import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'manage-role',
        loadChildren: () =>
          import('../modules/manage-role/manage-role.module').then((m) => m.ManageRoleModule),
      },
      {
        path: 'manage-subscription-pkgs',
        loadChildren: () =>
          import('../modules/manage-subscription-pkgs/manage-subscription-pkgs.module').then((m) => m.ManageSubscriptionPkgModule),
      },
      {
        path: 'manage-district-admin',
        loadChildren: () =>
          import('../modules/manage-district-admins/manage-districtAdmin.module').then((m) => m.ManageDistrictAdmin),
      },
      {
        path: 'manage-schools',
        loadChildren: () =>
          import('../modules/manage-schools/manage-school.module').then((m) => m.ManageSchool),
      },


      {
        path: 'user-profile',
        loadChildren: () =>
          import('../modules/user-profile/user-profile.module').then(
            (m) => m.UserProfileModule
          ),
      },
      {
        path: 'manage-country',
        loadChildren: () =>
          import('../modules/manage-countries/manage-countries.module').then(
            (m) => m.ManageCountriesModule
          ),
      },
      {
        path: 'manage-culinary-techniques',
        loadChildren: () =>
          import('../modules/manage-culinary-techniques/manage-culinary-techniques.module').then(
            (m) => m.ManageCulinaryTechniquesModule
          ),
      },
      {
        path: 'manage-ingredients',
        loadChildren: () =>
          import('../modules/manage-ingredients/manage-ingredients.module').then(
            (m) => m.ManageIngredientsModule
          ),
      },
      {
        path: 'manage-lessons',
        loadChildren: () =>
          import('../modules/manage-lessons/manage-lessons.module').then(
            (m) => m.ManageLessonsModule
          ),
      },
      {
        path: 'manage-nutrients',
        loadChildren: () =>
          import('../modules/manage-nutrients/manage-nutrients.module').then(
            (m) => m.ManageNutrientsModule
          ),
      },
      {
        path: 'manage-standards',
        loadChildren: () =>
          import('../modules/manage-standards/manage-standards.module').then(
            (m) => m.ManageStandardsModule
          ),
      },
      { 
        path: 'manage-stamps',
        loadChildren: () =>
          import('../modules/manage-stamps/manage-stamps.module').then(
            (m) => m.ManageStampsModule
          ),
      },
      {
        path: 'manage-subjects',
        loadChildren: () =>
          import('../modules/manage-subjects/manage-subjects.module').then(
            (m) => m.ManageSubjectsModule
          ),
      },
      {
        path: 'manage-tools',
        loadChildren: () =>
          import('../modules/manage-tools/manage-tools.module').then(
            (m) => m.ManageToolsModule
          ),
      },
      {
        path: 'manage-units-of-measurement',
        loadChildren: () =>
          import('../modules/manage-units-of-measurement/manage-units-of-measurement.module').then(
            (m) => m.ManageUnitsOfMeasurementModule
          ),
      },
      {
        path: 'manage-users',
        loadChildren: () =>
          import('../modules/manage-users/manage-users.module').then(
            (m) => m.ManageUsersModule
          ),
      },
      {
        path: 'manage-issuesFeedback',
        loadChildren: () =>
          import('../modules/manage-issuesOrFeedback/manage-issuesFeedback.module').then(
            (m) => m.ManageIssuesFeedbackModule
          ),
      },
      {
        path: 'manage-conversationSentence',
        loadChildren: () =>
          import('../modules/manage-conversationSentence/manage-conversationSentence.module').then(
            (m) => m.ManageConversationSentencesModule
          ),
      },
      {
        path: 'manage-health-hygiene',
        loadChildren: () =>
          import('../modules/manage-health-hygiene/manage-health-hygiene.module').then(
            (m) => m.ManageHealthHygieneModule
          ),
      },
      {
        path: 'manage-image-drag-drop',
        loadChildren: () =>
          import('../modules/manage-image-drag-drop/manage-image-drag-drop.module').then(
            (m) => m.ManageImageDragDropModule
          ),
      },
      {
        path: 'manage-image-flip-content',
        loadChildren: () =>
          import('../modules/manage-image-flip-content/manage-image-flip-content.module').then(
            (m) => m.ManageImageFlipContentModule
          ),
      },
      {
        path: 'manage-discussion-forum',
        loadChildren: () =>
          import('../modules/manage-discussion-forum/manage-discussion-forum.module').then(
            (m) => m.ManageDiscussionForum
          ),
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
