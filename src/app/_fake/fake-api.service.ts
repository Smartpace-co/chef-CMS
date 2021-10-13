import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { UsersTable } from './fake-db/users.table';
import { CarsTable } from './fake-db/cars.table';
import { UsersDataContext } from '../modules/manage-users/_fake/fake-server/_users.data-context';
import { Roles } from '../modules/manage-role/_fake/_role.data-context';
import { SubscriptionPkgs} from '../modules/manage-subscription-pkgs/_fake/_subscription_pkgs.data-context'
import { CountriesDataContext } from '../modules/manage-countries/fake/country.table';
import { LessionsDataContext } from '../modules/manage-lessons/fake/lessions.table';
import { IngredientsDataContext } from '../modules/manage-ingredients/fake/ingredients.table';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { SubjectDataContext } from '../modules/manage-subjects/fake/subject.table';
import { StandardsDataContext } from '../modules/manage-standards/fake/standards.table';
import { StampsDataContext } from '../modules/manage-stamps/fake/stamps.table';
import { NutrientsDataContext } from '../modules/manage-nutrients/fake/nutrients.table';
import { ToolsDataContext } from '../modules/manage-tools/fake/tools.table';
import { CulinaryTechniquesDataContext } from '../modules/manage-culinary-techniques/fake/ctm.table';
import { UnitOfMeasurementDataContext } from '../modules/manage-units-of-measurement/fake/unitOfMeasurement.table';

@Injectable({
  providedIn: 'root',
})
export class FakeAPIService implements InMemoryDbService {
  constructor() { }

  /**
   * Create Fake DB and API
   */
  createDb(): {} | Observable<{}> {
    // tslint:disable-next-line:class-name
    const db = {
      // auth module
      users: UsersTable.users,

      // data-table
      cars: CarsTable.cars,

      // manage users
      user: UsersDataContext.users,

      // manage roles
      roles: Roles.roles,
      subscriptionPkgs:SubscriptionPkgs.subscriptionPkgs,
      // manage countries
      countries: CountriesDataContext.countries,
      lessions: LessionsDataContext.lessions,
      ingredients: IngredientsDataContext.ingredients,
      subjects: SubjectDataContext.subjects,
      standards: StandardsDataContext.standards,
      stamps: StampsDataContext.stamps,
      nutrients: NutrientsDataContext.nutrients,
      tools: ToolsDataContext.tools,
      culinaryTechniques: CulinaryTechniquesDataContext.culinaryTechniques,
      unitOfMesurement:UnitOfMeasurementDataContext.unitOfMeasurement
    };
    return db;
  }
}
