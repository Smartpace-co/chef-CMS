import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, PaginatorState, SortState, GroupingState, TableService, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { Tools } from '../_models/tools.model';

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
export class ToolsService extends TableService<Tools> implements OnDestroy {
  API_URL = `${environment.apiUrl}/tool`;
  API_URL_MASTERS = `${environment.apiUrl}/master`
  constructor(@Inject(HttpClient) http,@Inject(Router) router) {
    super(http,router);
  }

  loadMasters(): Observable<any> {
    const safetylevel = this.http.get(this.API_URL_MASTERS + '/safetyLevel');
    return forkJoin([safetylevel]);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Tools>> {
    return this.http.get<Tools[]>(this.API_URL).pipe(
      map((response: any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<Tools> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  findByLanguage(tableState: ITableState,id): Observable<TableResponseModel<Tools>> {
    return this.http.get<Tools[]>(this.API_URL+'?filters[root]=[{"f":"systemLanguageId","v":'+id+'}]').pipe(
      map((response: any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<Tools> = {
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

  // updateRolesForItems(ids: number[], role: string): Observable<any> {
  //   return this.http.get<Tools[]>(this.API_URL).pipe(
  //     map((tools: Tools[]) => {
  //       return tools.filter(c => ids.indexOf(c.id) > -1).map(c => {
  //         c.role = role;
  //         return c;
  //       });
  //     }),
  //     exhaustMap((tools: Tools[]) => {
  //       const tasks$ = [];
  //       tools.forEach(customer => {
  //         tasks$.push(this.update(customer));
  //       });
  //       return forkJoin(tasks$);
  //     })
  //   );
  // }


  updateStatusForItems(ids: number[], status: any): Observable<any> {
    return this.http.get<Tools[]>(this.API_URL).pipe(
      map((tools: Tools[]) => {
        return tools.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((tools: Tools[]) => {
        const tasks$ = [];
        tools.forEach(tool => {
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

