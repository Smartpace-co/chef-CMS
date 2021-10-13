import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../_models/user.model';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, PaginatorState, SortState, GroupingState, TableService, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';

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
export class UsersService extends TableService<User> implements OnDestroy {
  API_URL = `${environment.apiUrl}/user`;
  constructor(@Inject(HttpClient) http,@Inject(Router) router) {
    super(http,router);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<User>> {
    return this.http.get<User[]>(this.API_URL).pipe(
      map((response:any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<User> = {
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

  updateRolesForItems(ids: number[], role: string): Observable<any> {
    return this.http.get<User[]>(this.API_URL).pipe(
      map((customers: User[]) => {
        return customers.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.roleId = role;
          return c;
        });
      }),
      exhaustMap((customers: User[]) => {
        const tasks$ = [];
        customers.forEach(customer => {
          tasks$.push(this.update(customer));
        });
        return forkJoin(tasks$);
      })
    );
  }


  updateStatusForItems(ids: number[], status: any): Observable<any> {
    return this.http.get<User[]>(this.API_URL).pipe(
      map((customers: User[]) => {
        return customers.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((customers: User[]) => {
        const tasks$ = [];
        customers.forEach(customer => {
          tasks$.push(this.update(customer));
        });
        return forkJoin(tasks$);
      })
    );
  }


  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getRole(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/role`);
  }
}
