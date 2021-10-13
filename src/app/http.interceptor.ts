import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header
    let token= JSON.parse(sessionStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`))?.token
    let clonedRequest;
    if(token){
   clonedRequest = req.clone({ headers: req.headers.append('token', `${token}`) });
   }
   else{
    return next.handle(req);

   }
    // Pass the cloned request instead of the original request to the next handle
    return next.handle(clonedRequest);
  }
}