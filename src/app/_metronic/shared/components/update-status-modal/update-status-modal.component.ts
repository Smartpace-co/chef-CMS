import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { first, delay, tap, catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-update-status-modal',
  templateUrl: './update-status-modal.component.html',
  styleUrls: ['./update-status-modal.component.scss']
})
export class UpdateStatusModalComponent implements OnInit {
  @Input() tableName: string;
  @Input() tableinfo: any;
  @Input() serviceName: any;
  @Input() ids: number[];
  @Input() columnName: any;
  status = 'Active';
  isLoading = false;
  tableData: any = [];
  subscriptions: Subscription[] = [];
  constructor(
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.tableData = this.tableinfo;
  }

  returnValue(column) {
    return column[this.columnName];
  }

  loadData() {
    const sb = this.serviceName.items$.pipe(
      first()
    ).subscribe((res: any) => {
      this.tableData = res.filter(c => this.ids.indexOf(c.id) > -1);
    });
    this.subscriptions.push(sb);
  }

  updateStatus() {
    this.isLoading = true;
    const sb = this.serviceName.updateStatusForItems(this.ids, this.status).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
