import { Injectable, OnDestroy, Inject } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, PaginatorState, SortState, GroupingState, TableService, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { DistrictAdmin } from "../_model/districtAdmin.model";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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
export class ManageDistrictAdminService extends TableService<DistrictAdmin> implements OnDestroy {
  API_URL = `${environment.chefkCoreApi}/districtAdmin`;
 API_URL_MASTERS = `${environment.apiUrl}/subscriptionPackage`

 constructor(@Inject(HttpClient) http,@Inject(Router) router) {
  super(http,router);
}
/**
   * To get encrypted query params in json.
   */
 queryParamsToJSON(encryptParam: string) {
   console.log(encryptParam)
  if (encryptParam) {
    console.log(encryptParam)
    let decoedString = atob(encryptParam);
    console.log(decoedString)

    let pairs = decoedString.slice(0).split('&');
    console.log(pairs)

    var result = {};
    pairs.forEach(function (pair: any) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
      console.log(result)

    });
    return JSON.parse(JSON.stringify(result));
  }
}

getAllPackageList(packageType: any, token: string, id?: any, customFields?: any, rid?: any): Observable<any> {
  let url = id ? this.API_URL_MASTERS+ "/"+ id: this.API_URL_MASTERS;
 // var headers_object = new HttpHeaders().set('token', token);
  let params = new HttpParams();
  let packge, role, sts;
  if (packageType || packageType === false) {
    packge = `{ "f": "isPrivate", "v": ${packageType} }`
    sts = `{ "f": "status", "v": true }`
  }
  if (rid) {
    role = `{ "f": "packageFor", "v": ${rid} }`;
  }
  params = params.append('filters[root]', `[${packge},${sts},${role}]`);
  if (customFields) {
    params = params.append('fields[root]', `["id","price","packageTitle"]`);
  }
  return this.http.get<any[]>(url, { params});
}
getActiveSubscribePackageDetails(id:any):Observable<any>{
  return this.http.get<any>(`${environment.chefkCoreApi}/active/subscribePackage/${id}`)
}

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<DistrictAdmin>> {
    return this.http.get<DistrictAdmin[]>(this.API_URL).pipe(
      map((response:any) => {
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<DistrictAdmin> = {
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

/**
   * To get master roles.
   */
 getAllMasterRoleDetails(): Observable<any> {
  return this.http.get<any[]>(`${environment.chefkCoreApi}/masterrole`);
}

  updateStatusForItems(ids: number[], status: any): Observable<any> {
    return this.http.get<DistrictAdmin[]>(this.API_URL).pipe(
      map((DistrictAdmin: DistrictAdmin[]) => {
        return DistrictAdmin.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((DistrictAdmin: DistrictAdmin[]) => {
        const tasks$ = [];
        DistrictAdmin.forEach(tool => {
          tasks$.push(this.update(tool));
        });
        return forkJoin(tasks$);
      })
    );
  }
  
   /**
   * Register district admin
   * @param data
   */
    public registerDistrictAdmin(data: any,token:any): Observable<any> {
       if (token) {
         var headers_object = new HttpHeaders().set('token', token);
       }
      const url = `${environment.chefkCoreApi}/districtAdmin/registration`;
         return this.http.post(url, data, { headers: headers_object })
        //return this.http.post(url, data)
       } 
/**
   * To get district profile and agent profile.
   */
 getDistrictProfile(id:any,token:any): Observable<any> {
  if (token) {
    var headers_object = new HttpHeaders().set('token', token);
  }
  return this.http.get<any[]>(`${environment.chefkCoreApi}/district/profile/${id}`, { headers: headers_object });
}

        /**
  * To update district/agent Profile details.
  */
  updateDistrictProfile(submission: any,id:any,token:any): Observable<any> {
    if (token) {
      var headers_object = new HttpHeaders().set('token', token);
    }
    return this.http.put(`${environment.chefkCoreApi}/district/profile/${id}`, submission,{ headers: headers_object });
  }

  /**
   * Create stripe payment session
   */

   createStripePaymentSession(data, token): Observable<any> {
      return this.http.post(`${environment.chefkCoreApi}/payment/session`, data)
  }
  
  contactValidator(cNumber: string): Observable<any> {
    return this.http.post<any>(`${environment.chefkCoreApi}/helper/checkPhoneNumberConflict`, { phone_number: cNumber });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
