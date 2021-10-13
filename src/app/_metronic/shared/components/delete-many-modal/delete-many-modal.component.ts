import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of } from 'rxjs';
import { delay, tap, catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-delete-many-modal',
  templateUrl: './delete-many-modal.component.html',
  styleUrls: ['./delete-many-modal.component.scss']
})
export class DeleteManyModalComponent implements OnInit {

  @Input() ids: number[];
  @Input() service:any;
  @Input() fileName:string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  delete() {
    this.isLoading = true;
    const sb = this.service.deleteItems(this.ids).pipe(
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
