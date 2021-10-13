import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DeleteManyModalComponent } from 'src/app/_metronic/shared/components/delete-many-modal/delete-many-modal.component';
import { DeleteModalComponent } from 'src/app/_metronic/shared/components/delete-modal/delete-modal.component';
import { UpdateStatusModalComponent } from 'src/app/_metronic/shared/components/update-status-modal/update-status-modal.component';
import { ICreateAction, IEditAction, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IUpdateStatusForSelectedAction, ISortView, IFilterView, IGroupingView, ISearchView, PaginatorState, SortState, GroupingState } from 'src/app/_metronic/shared/crud-table';
import { ManageDistrictAdminService } from './services/manage-districtAdmin.service';
import { EditDistrictAdminModalComponent } from './components/edit-districtAdmin-modal/edit-districtAdmin-modal.component';

@Component({
  selector: 'app-manage-districtAdmin',
  templateUrl: './manage-districtAdmin.component.html',
  styleUrls: ['./manage-districtAdmin.component.scss']
})
export class ManageDistrictAdminComponent implements OnInit,
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
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public districtAdminService: ManageDistrictAdminService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.districtAdminService.fetch();
    this.grouping = this.districtAdminService.grouping;
    this.paginator = this.districtAdminService.paginator;
    this.sorting = this.districtAdminService.sorting;
    const sb = this.districtAdminService.isLoading$.subscribe(res => this.isLoading = res);
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
    this.districtAdminService.patchState({ filter });
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
    this.districtAdminService.patchState({ searchTerm });
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
    this.districtAdminService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.districtAdminService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
     const modalRef = this.modalService.open(EditDistrictAdminModalComponent,{size:"lg"});
     modalRef.componentInstance.id = id;
     modalRef.result.then(() =>
      this.districtAdminService.fetch(),
       () => { }
     );
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.service = this.districtAdminService;
    modalRef.componentInstance.fileName = 'District Admin';
    modalRef.result.then(() => this.districtAdminService.fetch(), () => { });
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteManyModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.service = this.districtAdminService;
    modalRef.componentInstance.fileName = 'District Admin';
    modalRef.result.then(() => this.districtAdminService.fetch(), () => { });
  }

  updateStatusForSelected() {
    const modalRef = this.modalService.open(UpdateStatusModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.tableName = 'District Admin';
    modalRef.componentInstance.tableinfo = this.districtAdminService.items$;
    modalRef.componentInstance.serviceName = this.districtAdminService;
    modalRef.componentInstance.columnName = 'district Admin Title';
    modalRef.result.then(() => this.districtAdminService.fetch(), () => { });
  }

  fetchSelected() {
    const modalRef = this.modalService.open(UpdateStatusModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.tableName = 'DistrictAdmin';
    modalRef.componentInstance.tableinfo = this.districtAdminService.items$;
    modalRef.componentInstance.serviceName =  this.districtAdminService;
    modalRef.componentInstance.columnName = 'district Admin Title';
    modalRef.result.then(() => this.districtAdminService.fetch(), () => { });
  }

}
