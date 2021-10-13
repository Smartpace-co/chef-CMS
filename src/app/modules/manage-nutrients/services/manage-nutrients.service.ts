import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, PaginatorState, SortState, GroupingState, TableService, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { Nutrients } from '../_model/nutrients.model';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined
};

@Injectable({
  providedIn: 'root'
})
export class ManageNutrientsService extends TableService<Nutrients> implements OnDestroy {

  API_URL = `${environment.apiUrl}/nutrient`;
  API_URL_MASTERS = `${environment.apiUrl}/master`

  constructor(@Inject(HttpClient) http,@Inject(Router) router) {
    super(http,router);
  }
  
  loadMasters(): Observable<any> {
    const type = this.http.get(this.API_URL_MASTERS + '/type/nutrient');
    const uses = this.http.get(this.API_URL_MASTERS + '/uses/nutrient');
    const category = this.http.get(this.API_URL_MASTERS + '/category/nutrient');
    const origin = this.http.get(this.API_URL_MASTERS + '/origin/nutrient');
    const safetylevel = this.http.get(this.API_URL_MASTERS + '/safetyLevel');

    return forkJoin([type, uses, category, origin, safetylevel]);
  }
  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Nutrients>> {
    return this.http.get<Nutrients[]>(this.API_URL).pipe(
      map((response: any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<Nutrients> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }
  findByLanguage(tableState: ITableState,id): Observable<TableResponseModel<Nutrients>> {
    return this.http.get<Nutrients[]>(this.API_URL+'?filters[root]=[{"f":"systemLanguageId","v":'+id+'}]').pipe(
      map((response: any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<Nutrients> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  deleteItems(ids: number[] = []): Observable<any> {
    const tasks$ = [];
    ids.forEach(id => {
      tasks$.push(this.delete(id));
    });
    return forkJoin(tasks$);
  }



  updateStatusForItems(ids: number[], status: any): Observable<any> {
    return this.http.get<Nutrients[]>(this.API_URL).pipe(
      map((nutrients: Nutrients[]) => {
        return nutrients.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((nutrients: Nutrients[]) => {
        const tasks$ = [];
        nutrients.forEach(tool => {
          tasks$.push(this.update(tool));
        });
        return forkJoin(tasks$);
      })
    );
  }


  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
