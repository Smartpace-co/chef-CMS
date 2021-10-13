import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, PaginatorState, SortState, GroupingState, TableService, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { CulinaryTechniques } from '../_model/culinary-techniques.model';

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
export class ManageCulinaryTechniquesService extends TableService<CulinaryTechniques> implements OnDestroy {
  API_URL = `${environment.apiUrl}/culinaryTechnique`;
  API_URL_MASTERS = `${environment.apiUrl}/master`

  constructor(@Inject(HttpClient) http,@Inject(Router) router) {
    super(http,router);
  }

  loadMasters(): Observable<any> {
    const category = this.http.get(this.API_URL_MASTERS + '/category/culinaryTechniques');
    const tag = this.http.get(this.API_URL_MASTERS + '/tag/culinaryTechniques');

    return forkJoin([category, tag]);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<CulinaryTechniques>> {
    return this.http.get<CulinaryTechniques[]>(this.API_URL).pipe(
      map((response:any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<CulinaryTechniques> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  findByLanguage(tableState: ITableState,id): Observable<TableResponseModel<CulinaryTechniques>> {
    return this.http.get<CulinaryTechniques[]>(this.API_URL+'?filters[root]=[{"f":"systemLanguageId","v":'+id+'}]').pipe(
      map((response: any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<CulinaryTechniques> = {
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
    return this.http.get<CulinaryTechniques[]>(this.API_URL).pipe(
      map((culinaryTechniques: CulinaryTechniques[]) => {
        return culinaryTechniques.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((culinaryTechniques: CulinaryTechniques[]) => {
        const tasks$ = [];
        culinaryTechniques.forEach(tool => {
          tasks$.push(this.update(tool));
        });
        return forkJoin(tasks$);
      })
    );
  }

  addNewCategory(data){
    return this.http.post(this.API_URL_MASTERS + '/category/culinaryTechniques',data);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
