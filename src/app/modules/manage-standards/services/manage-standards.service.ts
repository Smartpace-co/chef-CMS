import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, PaginatorState, SortState, GroupingState, TableService, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { Standards } from '../_model/standard.model';

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
export class ManageStandardsService extends TableService<Standards> implements OnDestroy {

  API_URL = `${environment.apiUrl}/standard`;
  constructor(@Inject(HttpClient) http,@Inject(Router) router) {
    super(http,router);
  }

  //masters
  loadMasters(): Observable<any> {
    const grade = this.http.get(this.API_URL_MASTERS + '/grade');

    return forkJoin([grade]);
  }
  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Standards>> {
    return this.http.get<Standards[]>(this.API_URL).pipe(
      map((response:any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<Standards> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }
  getSkills(subjectId): Observable<any>{
    return this.http.get(this.API_URL_MASTERS + '/skill?filters[root]=[{"f":"subjectId","v":'+subjectId+'}]');
  }

  findByLanguage(tableState: ITableState,id): Observable<TableResponseModel<Standards>> {
    return this.http.get<Standards[]>(this.API_URL+'?filters[root]=[{"f":"systemLanguageId","v":'+id+'}]&fields[subjects]=["id","subjectTitle"]').pipe(
      map((response: any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<Standards> = {
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
    return this.http.get<Standards[]>(this.API_URL).pipe(
      map((standards: Standards[]) => {
        return standards.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((standards: Standards[]) => {
        const tasks$ = [];
        standards.forEach(tool => {
          tasks$.push(this.update(tool));
        });
        return forkJoin(tasks$);
      })
    );
  }

  getSubjects(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/subject`);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
