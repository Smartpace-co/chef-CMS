// tslint:disable:variable-name
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PaginatorState } from '../models/paginator.model';
import { ITableState, TableResponseModel } from '../models/table.model';
import { BaseModel } from '../models/base.model';
import { SortState } from '../models/sort.model';
import { GroupingState } from '../models/grouping.model';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../modules/auth/_services/auth.service'
import { Router} from '@angular/router';
const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined
};

export abstract class TableService<T> {
  private authSessionStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  // Private fields
  private _items$ = new BehaviorSubject<T[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];

  // Getters
  get items$() {
    return this._items$.asObservable();
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this._errorMessage.asObservable();
  }
  get subscriptions() {
    return this._subscriptions;
  }
  // State getters
  get paginator() {
    return this._tableState$.value.paginator;
  }
  get filter() {
    return this._tableState$.value.filter;
  }
  get sorting() {
    return this._tableState$.value.sorting;
  }
  get searchTerm() {
    return this._tableState$.value.searchTerm;
  }
  get grouping() {
    return this._tableState$.value.grouping;
  }

  protected http: HttpClient;
  public router :Router;
  public authService: AuthService
  // API URL has to be overrided
  API_URL = `${environment.apiUrl}/endpoint`;
  API_URL_MASTERS = `${environment.apiUrl}/master`
  CHEFCORE_API_URL = `${environment.chefkCoreApi}`;
  constructor(http: HttpClient,router:Router) {
    this.http = http;
    this.router= router;
  }

  // CREATE
  // server should return the object with ID
  create(item: BaseModel): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<BaseModel>(this.API_URL, item).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('CREATE ITEM', err);
        return of(err.error);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // CREATE
  // server should return the object with ID
  insertBulkRecord(item): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post(this.API_URL + '/file', item).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('CREATE Lessons ', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }


  // READ (Returning filtered list of entities)
  find(tableState: ITableState): Observable<TableResponseModel<T>> {
    const url = this.API_URL + '/find';
    this._errorMessage.next('');
    return this.http.post<TableResponseModel<T>>(url, tableState).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  findByLanguage(tableState: ITableState, id): Observable<TableResponseModel<T>> {
    const url = this.API_URL + '?filters[root]=[{"f":"systemLanguageId","v":' + id + '}]';
    this._errorMessage.next('');
    return this.http.post<TableResponseModel<T>>(url, tableState).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS by lang', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  findLessonsByFilter(tableState: ITableState, id, filter): Observable<TableResponseModel<T>> {
    const url = this.API_URL + '?filters[root]=[{"f":"' + filter + '","v":' + id + '}]&fields[root]=["id","lessonTitle","status"]';
    this._errorMessage.next('');
    return this.http.post<TableResponseModel<T>>(url, tableState).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS by filter', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  getItemById(id: number): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${id}`;
    return this.http.get<BaseModel>(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('GET ITEM BY IT', id, err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // UPDATE
  update(item: BaseModel): Observable<any> {
    const url = `${this.API_URL}/${item.id}`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.put(url, item).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('UPDATE ITEM', item, err);
        return of(err.error);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // UPDATE
  updates(item: BaseModel): Observable<any> {
    const url = `${this.API_URL}/${item.id}`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.put(url, item).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('UPDATE ITEM', item, err);
        return of(item);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // UPDATE Status
  updateStatusForItems(ids: number[], status: number): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const body = { ids, status };
    const url = this.API_URL + '/updateStatus';
    console.log(body)
    return this.http.put(url, body).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('UPDATE STATUS FOR SELECTED ITEMS', ids, status, err);
        return of([]);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // DELETE
  delete(id: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${id}`;
    return this.http.delete(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('DELETE ITEM', id, err);
        return of(err.error);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // delete list of items
  deleteItems(ids: number[] = []): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = this.API_URL + '/deleteItems';
    const body = { ids };
    return this.http.put(url, body).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('DELETE SELECTED ITEMS', ids, err);
        return of([]);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  public fetch() {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find(this._tableState$.value)
      .pipe(
        tap((res: TableResponseModel<T>) => {
          this._items$.next(res.items);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              res.total
            ),
          });
        }),
        catchError((err) => {
          if(err.status==401){
            sessionStorage.removeItem(this.authSessionStorageToken);
            this.router.navigate(['/auth/login'], {
              queryParams: {},
            });
          }
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item.id;
          });
          this.patchStateWithoutFetch({
            grouping: this._tableState$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  public fetchByLanguage(languageId) {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.findByLanguage(this._tableState$.value, languageId)
      .pipe(
        tap((res: TableResponseModel<T>) => {
          this._items$.next(res.items);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              res.total
            ),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item.id;
          });
          this.patchStateWithoutFetch({
            grouping: this._tableState$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  public fetchLessonByFilter(id, filter) {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.findLessonsByFilter(this._tableState$.value, id, filter)
      .pipe(
        tap((res: TableResponseModel<T>) => {
          this._items$.next(res.items);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              res.total
            ),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          this._items$.next([]);
          return of({
            items: [],
            total: 0
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item.id;
          });
          this.patchStateWithoutFetch({
            grouping: this._tableState$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  imageUpload(files: File[]) {
    //this._isLoading$.next(true);
    //this._errorMessage.next('');
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file', f))
    return this.http.post(`${environment.apiUrl}/imageUpload`, formData).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('Image Upload', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  audioUpload(files: File[]) {
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file', f))
    return this.http.post(`${environment.apiUrl}/audioUpload`, formData).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('Audio Upload', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  /**
   * Upload excel file
   *  **/
  uploadFile(file) {
    var formData = new FormData();
    formData.append('file', file)
    return this.http.post(`${environment.apiUrl}/fileUpload`, formData).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('Excel File Upload', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  /**
   * Download sample excel file 
   */

  downloadFile() {
    return this.http.get(`${environment.apiUrl}/demoFile`, { responseType: "blob" })
  }

  public setDefaults() {
    this.patchStateWithoutFetch({ filter: {} });
    this.patchStateWithoutFetch({ sorting: new SortState() });
    this.patchStateWithoutFetch({ grouping: new GroupingState() });
    this.patchStateWithoutFetch({ searchTerm: '' });
    this.patchStateWithoutFetch({
      paginator: new PaginatorState()
    });
    this._isFirstLoading$.next(true);
    this._isLoading$.next(true);
    this._tableState$.next(DEFAULT_STATE);
    this._errorMessage.next('');
  }

  // Base Methods
  public patchState(patch: Partial<ITableState>) {
    this.patchStateWithoutFetch(patch);
    this.fetch();
  }

  public patchStateWithoutFetch(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }

  /**
  * To get system language list.
  */
  getLanguageList(): Observable<any> {
    return this.http.get<any[]>(`${this.CHEFCORE_API_URL}/master/systemLanguage`);
  }

  /**
  * To get system language list by filter.
  */
  getLanguageListByFilter(model, id): Observable<any> {
    return this.http.get<any[]>(`${this.CHEFCORE_API_URL}/master/systemLanguage?model=${model}&id=${id}`);
  }

  loadQuestionAndAnsType(): Observable<any> {
    const questionType = this.http.get(this.API_URL_MASTERS + '/questionType');
    const answerType = this.http.get(this.API_URL_MASTERS + '/answerType');
    return forkJoin([questionType, answerType]);
  }

  loadQuestionAndAnsTypeForSubjectQue(): Observable<any> {
    const questionType = this.http.get(this.API_URL_MASTERS + '/questionType?filters[root]=[{"f":"key","v":["ela", "math", "ngss", "ncss"]}]');
    const answerType = this.http.get(this.API_URL_MASTERS + '/answerType');
    return forkJoin([questionType, answerType]);
  }
}
