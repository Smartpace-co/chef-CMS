import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DeleteManyModalComponent } from 'src/app/_metronic/shared/components/delete-many-modal/delete-many-modal.component';
import { DeleteModalComponent } from 'src/app/_metronic/shared/components/delete-modal/delete-modal.component';
import { UpdateStatusModalComponent } from 'src/app/_metronic/shared/components/update-status-modal/update-status-modal.component';
import { ICreateAction, IEditAction, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IUpdateStatusForSelectedAction, ISortView, IFilterView, IGroupingView, ISearchView, PaginatorState, SortState, GroupingState } from 'src/app/_metronic/shared/crud-table';
import { EditIssuesFeedbackModalComponent } from './components/edit-issues-feedback-modal/edit-issues-feedback-modal.component';

import { ManageIssuesFeedbackService } from './services/manage-issuesFeedback.service';

@Component({
  selector: 'app-manage-issuesFeedback',
  templateUrl: './manage-issuesFeedback.component.html',
  styleUrls: ['./manage-issuesFeedback.component.scss']
})
export class ManageIssuesFeedbackComponent implements OnInit,
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
  IFilterView {

  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  reports:any;

  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public issuesFeedbackService: ManageIssuesFeedbackService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.issuesFeedbackService.fetch();
    this.grouping = this.issuesFeedbackService.grouping;
    this.paginator = this.issuesFeedbackService.paginator;
    this.sorting = this.issuesFeedbackService.sorting;
    const sb = this.issuesFeedbackService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
   // this.getAllReportIssuesList()
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
    this.issuesFeedbackService.patchState({ filter });
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
    this.issuesFeedbackService.patchState({ searchTerm });
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
    this.issuesFeedbackService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.issuesFeedbackService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditIssuesFeedbackModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.issuesFeedbackService.fetch(),
      () => { }
    );
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.service = this.issuesFeedbackService;
    modalRef.componentInstance.fileName = 'Country';
    modalRef.result.then(() => this.issuesFeedbackService.fetch(), () => { });
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteManyModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.service = this.issuesFeedbackService;
    modalRef.componentInstance.fileName = 'Country';
    modalRef.result.then(() => this.issuesFeedbackService.fetch(), () => { });
  }

  updateStatusForSelected() {
    const modalRef = this.modalService.open(UpdateStatusModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.tableName = 'Country';
    modalRef.componentInstance.tableinfo = this.issuesFeedbackService.items$;
    modalRef.componentInstance.serviceName = this.issuesFeedbackService;
    modalRef.componentInstance.columnName = 'countryName';
    modalRef.result.then(() => this.issuesFeedbackService.fetch(), () => { });
  }

  fetchSelected() {
    const modalRef = this.modalService.open(UpdateStatusModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.tableName = 'issuesFeedback';
    modalRef.componentInstance.tableinfo = this.issuesFeedbackService.items$;
    modalRef.componentInstance.serviceName =  this.issuesFeedbackService;
    modalRef.result.then(() => this.issuesFeedbackService.fetch(), () => { });
  }
}
