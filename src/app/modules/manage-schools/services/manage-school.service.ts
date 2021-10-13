import { Injectable, OnDestroy, Inject } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, PaginatorState, SortState, GroupingState, TableService, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { School } from "../_model/school.model";
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
export class ManageSchoolService extends TableService<School> implements OnDestroy {
  API_URL = `${environment.chefkCoreApi}/school`;
 API_URL_MASTERS = `${environment.apiUrl}/subscriptionPackage`

 constructor(@Inject(HttpClient) http,@Inject(Router) router) {
  super(http,router);
}
/**
   * To get encrypted query params in json.
   */
 queryParamsToJSON(encryptParam: string) {
  if (encryptParam) {
    let decoedString = atob(encryptParam);
    let pairs = decoedString.slice(0).split('&');
    var result = {};
    pairs.forEach(function (pair: any) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    return JSON.parse(JSON.stringify(result));
  }
}


// READ
find(tableState: ITableState): Observable<TableResponseModel<School>> {
  return this.http.get<School[]>(this.API_URL).pipe(
    map((response:any) => {
      const filteredResult = baseFilter(response.data.rows, tableState);
      const result: TableResponseModel<School> = {
        items: filteredResult.items,
        total: filteredResult.total
      };
      return result;
    })
  );
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
  

  deleteItems(ids: number[] = []): Observable<any> {
    const tasks$ = [];
    ids.forEach(id => {
      tasks$.push(this.delete(id));
    });
    return forkJoin(tasks$);
  }



  updateStatusForItems(ids: number[], status: any): Observable<any> {
    return this.http.get<School[]>(this.API_URL).pipe(
      map((DistrictAdmin: School[]) => {
        return DistrictAdmin.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((DistrictAdmin: School[]) => {
        const tasks$ = [];
        DistrictAdmin.forEach(tool => {
          tasks$.push(this.update(tool));
        });
        return forkJoin(tasks$);
      })
    );
  }
   /**
   * Register School admin
   * @param data
   */
    public registerSchoolAdmin(data: any,token:any): Observable<any> {
       if (token) {
         var headers_object = new HttpHeaders().set('token', token);
     }
         return this.http.post(this.API_URL, data, { headers: headers_object })
       } 

/**
   * To get master roles.
   */
 getAllMasterRoleDetails(): Observable<any> {
  return this.http.get<any[]>(`${environment.chefkCoreApi}/masterrole`);
}

getActiveSubscribePackageDetails(id:any):Observable<any>{
  return this.http.get<any>(`${environment.chefkCoreApi}/active/subscribePackage/${id}`)
}
       
/**
   * To get School profile and agent profile.
   */
 getSchoolProfile(id:any,token:any): Observable<any> {
 return this.http.get<any[]>(this.API_URL+`/${id}`);
//  return this.http.get<any[]>(this.API_URL+`/${id}`);
}
/**
   * To get all Districts.
   */
 getAllDistricts(): Observable<any> {
  return this.http.get<any[]>(`${environment.chefkCoreApi}/districts`);
}
/**
   * To get all Schools.
   */
 getAllSchools(token:any): Observable<any> {
  if (token) {
    var headers_object = new HttpHeaders().set('token', token);
}
  return this.http.get<any[]>(`${this.API_URL}/school?token=${token}`, { headers: headers_object });
}
        /**
  * To update School/agent Profile details.
  */
  updateSchoolProfile(submission: any,id:any,token:any): Observable<any> {
    return this.http.put(this.API_URL+`/${id}`, submission);
  }

  /**
   * To subscription package details by id.
   */
 getSubscriptionPackageDetails(id:any,token:any): Observable<any> {
  return this.http.get<any[]>(this.API_URL_MASTERS+`/${id}`);
 //  return this.http.get<any[]>(this.API_URL+`/${id}`);
 }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
