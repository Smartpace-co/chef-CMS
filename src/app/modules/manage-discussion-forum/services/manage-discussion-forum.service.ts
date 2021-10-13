import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, PaginatorState, SortState, GroupingState, TableService, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { DiscussionForum } from "../_model/discussionForum.model";

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
export class ManageDiscussionForumService extends TableService<DiscussionForum> implements OnDestroy {

  API_URL = `${environment.apiUrl}/discussionForum`;

  constructor(@Inject(HttpClient) http,@Inject(Router) router) {
    super(http,router);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<DiscussionForum>> {
    return this.http.get<DiscussionForum[]>(this.API_URL).pipe(
      map((response:any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<DiscussionForum> = {
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
    return this.http.get<DiscussionForum[]>(this.API_URL).pipe(
      map((DiscussionForum: DiscussionForum[]) => {
        return DiscussionForum.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((DiscussionForum: DiscussionForum[]) => {
        const discussionForums$ = [];
        DiscussionForum.forEach(discussionForum => {
          discussionForums$.push(this.update(discussionForum));
        });
        return forkJoin(discussionForums$);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
