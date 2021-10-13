import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of } from 'rxjs';
import { first, delay, tap, catchError, finalize } from 'rxjs/operators';
import { UsersService } from '../../services/user.service';
import { User } from '../../_models/user.model';

@Component({
  selector: 'app-update-users-status-modal',
  templateUrl: './update-users-status-modal.component.html',
  styleUrls: ['./update-users-status-modal.component.scss']
})
export class UpdateUsersStatusModalComponent implements OnInit, OnDestroy {

  @Input() ids: number[];
  status = 2;
  customers: User[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private usersService: UsersService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    const sb = this.usersService.items$.pipe(
      first()
    ).subscribe((res: User[]) => {
      this.customers = res.filter(c => this.ids.indexOf(c.id) > -1);
    });
    this.subscriptions.push(sb);
  }

  updateCustomersStatus() {
    this.isLoading = true;
    const sb = this.usersService.updateStatusForItems(this.ids, +this.status).pipe(
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
