import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  first,
  map,
} from 'rxjs/operators';
import { DeleteManyModalComponent } from 'src/app/_metronic/shared/components/delete-many-modal/delete-many-modal.component';
import { DeleteModalComponent } from 'src/app/_metronic/shared/components/delete-modal/delete-modal.component';
import {
  ICreateAction,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
  PaginatorState,
  SortState,
  GroupingState,
} from 'src/app/_metronic/shared/crud-table';
import { UsersService } from './services/user.service';

@Component({
  selector: 'app-manage-external-users',
  templateUrl: './manage-external-users.component.html',
  styleUrls: ['./manage-external-users.component.scss'],
})
export class ManageExternalUsersComponent
  implements
    OnInit,
    OnDestroy,
    ICreateAction,
    IEditAction,
    IDeleteAction,
    IDeleteSelectedAction,
    IFetchSelectedAction,
    IUpdateStatusForSelectedAction,
    ISortView,
    IFilterView,
    IGroupingView,
    ISearchView,
    IFilterView
{
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  usercountData: any;
  isSending: boolean = false;
  currEmail: string | null = null;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public userService: UsersService,
    private changeDetectorRef: ChangeDetectorRef,
    private toast: ToastrService
  ) {
    this.getExternalUserCount();
  }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.userService.fetch();
    this.grouping = this.userService.grouping;
    this.paginator = this.userService.paginator;
    this.sorting = this.userService.sorting;
    const sb = this.userService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
  }

  getExternalUserCount() {
    const sb = this.userService
      .getExternalUsersCount()
      .pipe(
        first(),
        catchError((errorMessage) => {
          return of(null);
        })
      )
      .subscribe((response: any) => {
        this.usercountData = response.data;
        console.log(3333333333333333, this.usercountData);
      });
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      status: [''],
      type: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.status.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.type.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = {};
    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    const type = this.filterGroup.get('type').value;
    if (type) {
      filter['type'] = type;
    }
    this.userService.patchState({ filter });
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        /*
    The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
    we are limiting the amount of server requests emitted to a maximum of one every 150ms
    */
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.userService.patchState({ searchTerm });
  }

  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.userService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.userService.patchState({ paginator });
  }

  sendEmailPassword(email: string) {
    this.currEmail = email;
    let data = { email: email };
    this.isSending = true;

    this.userService.sendEmailNewPassword(data).subscribe(
      () => {
        this.isSending = false;
        this.changeDetectorRef.detectChanges();
        this.toast.success(
          'ٌReset Email Password has been sent successfully',
          'Success'
        );
      },
      (err: Error) => {
        this.changeDetectorRef.detectChanges();
        this.isSending = false;
        this.toast.error(err.message, 'Error');
      }
    );

    ////////////////////////////////////***************
    ////////// ********************** */
    // Here, handle Error: try with fake promise like below then run above lines

    // setTimeout(() => {
    // Faild
    //   let message = `ٌReset Email Password has been sent successfully`;
    //   this.isSending = false;
    //   this.changeDetectorRef.detectChanges();
    //   this.toast.success(message, 'Success');
    // }, 800);
  }

  // form actions
  create() {}

  delete() {}

  deleteSelected() {}

  edit() {}
  fetchSelected() {}
  updateStatusForSelected() {}
}
