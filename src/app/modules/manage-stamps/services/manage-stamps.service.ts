import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, PaginatorState, SortState, GroupingState, TableService, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { Stamps } from '../_model/stamp.model';

@Injectable({
  providedIn: 'root'
})
export class ManageStampsService extends TableService<Stamps> implements OnDestroy {

  API_URL = `${environment.apiUrl}/stamp`;
  API_URL_MASTERS = `${environment.apiUrl}/master`
  API_URL_COUNTRY = `${environment.apiUrl}/country`;

  constructor(@Inject(HttpClient) http,@Inject(Router) router) {
    super(http,router);
  }

  loadMasters(): Observable<any> {
    const levelType = this.http.get(this.API_URL_MASTERS + '/levelType');
    const learningType = this.http.get(this.API_URL_MASTERS + '/learningType');
    const countryType = this.http.get(this. API_URL_COUNTRY);
    return forkJoin([countryType,levelType, learningType]);
  }
  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Stamps>> {
    return this.http.get<Stamps[]>(this.API_URL).pipe(
      map((response: any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<Stamps> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  findByLanguage(tableState: ITableState,id): Observable<TableResponseModel<Stamps>> {
    return this.http.get<Stamps[]>(this.API_URL+'?filters[root]=[{"f":"systemLanguageId","v":'+id+'}]').pipe(
      map((response: any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<Stamps> = {
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
    return this.http.get<Stamps[]>(this.API_URL).pipe(
      map((stamps: Stamps[]) => {
        return stamps.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((stamps: Stamps[]) => {
        const tasks$ = [];
        stamps.forEach(tool => {
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

