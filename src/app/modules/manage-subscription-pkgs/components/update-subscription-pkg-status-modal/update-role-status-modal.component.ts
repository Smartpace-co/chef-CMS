import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of } from 'rxjs';
import { first, delay, tap, catchError, finalize } from 'rxjs/operators';
import { SubscriptionPkgsService } from '../../services/subscription-pkgs.service';
import { SubscriptionPkgs } from '../../_models/subscription_pkg.model';

@Component({
  selector: 'app-update-role-status-modal',
  templateUrl: './update-role-status-modal.component.html',
  styleUrls: ['./update-role-status-modal.component.scss']
})
export class UpdateRoleStatusModalComponent implements OnInit {

  @Input() ids: number[];
  status = true;
  subscriptionPkgs: SubscriptionPkgs[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private subscriptionPkgsService: SubscriptionPkgsService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    const sb = this.subscriptionPkgsService.items$.pipe(
      first()
    ).subscribe((res: SubscriptionPkgs[]) => {
      this.subscriptionPkgs = res.filter(c => this.ids.indexOf(c.id) > -1);
    });
    this.subscriptions.push(sb);
  }

  updateRolesStatus() {
    this.isLoading = true;
    const sb = this.subscriptionPkgsService.updateStatusForItems(this.ids, this.status).pipe(
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
