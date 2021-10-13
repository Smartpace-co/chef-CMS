import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, PaginatorState, SortState, GroupingState, TableService, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { UnitOfMeasurement } from '../_model/manage-unit-of-measurement.model';

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
export class ManageUnitOfMeasureService extends TableService<UnitOfMeasurement> implements OnDestroy {

  API_URL = `${environment.apiUrl}/unitOfMeasurement`;
  
  constructor(@Inject(HttpClient) http,@Inject(Router) router) {
    super(http,router);
  }
  // READ
  find(tableState: ITableState): Observable<TableResponseModel<UnitOfMeasurement>> {
    return this.http.get<UnitOfMeasurement[]>(this.API_URL).pipe(
      map((response:any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<UnitOfMeasurement> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  findByLanguage(tableState: ITableState,id): Observable<TableResponseModel<UnitOfMeasurement>> {
    return this.http.get<UnitOfMeasurement[]>(this.API_URL+'?filters[root]=[{"f":"systemLanguageId","v":'+id+'}]').pipe(
      map((response: any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<UnitOfMeasurement> = {
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
    return this.http.get<UnitOfMeasurement[]>(this.API_URL).pipe(
      map((unitOfMeasurement: UnitOfMeasurement[]) => {
        return unitOfMeasurement.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((unitOfMeasurement: UnitOfMeasurement[]) => {
        const tasks$ = [];
        unitOfMeasurement.forEach(tool => {
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
