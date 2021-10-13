import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, PaginatorState, SortState, GroupingState, TableService, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { SubscriptionPkgs } from '../_models/subscription_pkg.model';

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
export class SubscriptionPkgsService extends TableService<SubscriptionPkgs> implements OnDestroy {
  API_URL = `${environment.apiUrl}/subscriptionPackage`;
  API_URL_LESSON = `${environment.apiUrl}/lesson`;

  constructor(@Inject(HttpClient) http,@Inject(Router) router) {
    super(http,router);
  }

  loadMasterRole(){
    return this.http.get(`${environment.chefkCoreApi}`+'/masterRole').pipe(
      map((response: any) => {
     
        return response.data;
      })
    );
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<SubscriptionPkgs>> {
    return this.http.get<SubscriptionPkgs[]>(this.API_URL).pipe(
      map((response: any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<SubscriptionPkgs> = {
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

  updateSubscriptionPkgsForItems(ids: number[], title: string): Observable<any> {
    return this.http.get<SubscriptionPkgs[]>(this.API_URL).pipe(
      map((roles: SubscriptionPkgs[]) => {
        return roles.filter(r => ids.indexOf(r.id) > -1).map(c => {
          c.title = title;
          return c;
        });
      }),
      exhaustMap((roles: SubscriptionPkgs[]) => {
        const tasks$ = [];
        roles.forEach(role => {
          tasks$.push(this.update(role));
        });
        return forkJoin(tasks$);
      })
    );
  }

  updateStatusForItems(ids: number[], status: any): Observable<any> {
    return this.http.get<SubscriptionPkgs[]>(this.API_URL).pipe(
      map((roles: SubscriptionPkgs[]) => {
        return roles.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((roles: SubscriptionPkgs[]) => {
        const tasks$ = [];
        roles.forEach(customer => {
          tasks$.push(this.update(customer));
        });
        return forkJoin(tasks$);
      })
    );
  }

  loadLesson(data){
    return this.http.get<SubscriptionPkgs[]>(this.API_URL_LESSON+'?grades='+data).pipe(
      map((response: any) => {
         return response.data;     
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
