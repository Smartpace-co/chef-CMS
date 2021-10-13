import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, PaginatorState, SortState, GroupingState, TableService, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { Roles } from '../_models/role.model';
import {AuthService} from '../../../modules/auth/_services/auth.service'

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
export class RolesService extends TableService<Roles> implements OnDestroy {
  API_URL = `${environment.apiUrl}/role`;

  constructor(@Inject(HttpClient) http,@Inject(Router) router,  public authService:AuthService
  ) {
    super(http,router);
    
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Roles>> {
    
    return this.http.get<Roles[]>(this.API_URL).pipe(
      map((response:any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<Roles> = {
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

  updateRolesForItems(ids: number[], title: string): Observable<any> {
    return this.http.get<Roles[]>(this.API_URL).pipe(
      map((roles: Roles[]) => {
        return roles.filter(r => ids.indexOf(r.id) > -1).map(c => {
          c.title = title;
          return c;
        });
      }),
      exhaustMap((roles: Roles[]) => {
        const tasks$ = [];
        roles.forEach(role => {
          tasks$.push(this.update(role));
        });
        return forkJoin(tasks$);
      })
    );
  }

  updateStatusForItems(ids: number[], status: any): Observable<any> {
    return this.http.get<Roles[]>(this.API_URL).pipe(
      map((roles: Roles[]) => {
        return roles.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((roles: Roles[]) => {
        const tasks$ = [];
        roles.forEach(customer => {
          tasks$.push(this.update(customer));
        });
        return forkJoin(tasks$);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
