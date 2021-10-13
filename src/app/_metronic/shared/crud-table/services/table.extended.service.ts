import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TableService } from './table.service';

@Injectable({
  providedIn: 'root'
})
export class TableExtendedService extends TableService<any> {
  constructor(@Inject(HttpClient) http,@Inject(Router) router) {
    super(http,router);
  }
}
