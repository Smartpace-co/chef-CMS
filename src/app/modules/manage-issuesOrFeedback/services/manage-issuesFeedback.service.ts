import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, PaginatorState, SortState, GroupingState, TableService, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { IssuesFeedback } from '../_model/issuesFeedback.model';

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
export class ManageIssuesFeedbackService extends TableService<IssuesFeedback> implements OnDestroy {
  API_URL = `${environment.apiUrl}/issueFeedback`;

  constructor(@Inject(HttpClient) http,@Inject(Router) router) {
    super(http,router);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<IssuesFeedback>> {
    return this.http.get<IssuesFeedback[]>(this.API_URL).pipe(
      map((response:any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<IssuesFeedback> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }


}
