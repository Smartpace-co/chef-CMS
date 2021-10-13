import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DeleteManyModalComponent } from 'src/app/_metronic/shared/components/delete-many-modal/delete-many-modal.component';
import { DeleteModalComponent } from 'src/app/_metronic/shared/components/delete-modal/delete-modal.component';
import { UpdateStatusModalComponent } from 'src/app/_metronic/shared/components/update-status-modal/update-status-modal.component';
import { ICreateAction, IEditAction, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IUpdateStatusForSelectedAction, ISortView, IFilterView, IGroupingView, ISearchView, PaginatorState, SortState, GroupingState } from 'src/app/_metronic/shared/crud-table';
import { UpdateRoleStatusModalComponent } from '../manage-role/components/update-role-status-modal/update-role-status-modal.component';
import { EditUnitsOfMeasurementModalComponent } from './components/edit-units-of-measurement-modal/edit-units-of-measurement-modal.component';
import { ManageUnitOfMeasureService } from './service/unitOfMesurement.service';

@Component({
  selector: 'app-manage-units-of-measurement',
  templateUrl: './manage-units-of-measurement.component.html',
  styleUrls: ['./manage-units-of-measurement.component.scss']
})
export class ManageUnitsOfMeasurementComponent implements OnInit,
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
  languageMaster = [];


  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public unitOfMeasurementService: ManageUnitOfMeasureService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.loadLanguage();
    this.filterForm();
    this.searchForm();
    this.unitOfMeasurementService.fetch();
    this.grouping = this.unitOfMeasurementService.grouping;
    this.paginator = this.unitOfMeasurementService.paginator;
    this.sorting = this.unitOfMeasurementService.sorting;
    const sb = this.unitOfMeasurementService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  loadLanguage() {
    this.unitOfMeasurementService.getLanguageList().subscribe((res) => {
      this.languageMaster = res.data;
    }, (e) => {
      console.log(e)
    })
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
    this.unitOfMeasurementService.patchState({ filter });
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
    this.unitOfMeasurementService.patchState({ searchTerm });
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
    this.unitOfMeasurementService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.unitOfMeasurementService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number, referenceId?: number, languageId?: number) {
    const modalRef = this.modalService.open(EditUnitsOfMeasurementModalComponent);
    if (referenceId) {
      modalRef.componentInstance.refId = referenceId;
    }
    if (languageId) {
      modalRef.componentInstance.languageId = languageId;
    }
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.unitOfMeasurementService.fetch(),
      () => { }
    );
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.service = this.unitOfMeasurementService;
    modalRef.componentInstance.fileName = 'Unit Of Measurement';
    modalRef.result.then(() => this.unitOfMeasurementService.fetch(), () => { });
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteManyModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.service = this.unitOfMeasurementService;
    modalRef.componentInstance.fileName = 'Unit Of Measurement';
    modalRef.result.then(() => this.unitOfMeasurementService.fetch(), () => { });
  }

  updateStatusForSelected() {
    const modalRef = this.modalService.open(UpdateStatusModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.tableName = 'Unit Of Measurement';
    modalRef.componentInstance.tableinfo = this.unitOfMeasurementService.items$;
    modalRef.componentInstance.serviceName = this.unitOfMeasurementService;
    modalRef.componentInstance.columnName = 'unitOfMeasure';
    modalRef.result.then(() => this.unitOfMeasurementService.fetch(), () => { });
  }
  
  fetchSelected() {
    const modalRef = this.modalService.open(UpdateStatusModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.tableName = 'Unit Of Measurement';
    modalRef.componentInstance.tableinfo = this.unitOfMeasurementService.items$;
    modalRef.componentInstance.serviceName =  this.unitOfMeasurementService;
    modalRef.componentInstance.columnName = 'unitOfMeasure';
    modalRef.result.then(() => this.unitOfMeasurementService.fetch(), () => { });
  }

  changeLanguage(e) {
    let languageId = e.target.value;
    if (languageId == "null") {
      this.unitOfMeasurementService.fetch();
    } else {
      this.unitOfMeasurementService.fetchByLanguage(languageId);
    }
  }

  addUnitOfMeasurement(uom) {
    if (uom.referenceId) {
      this.edit(undefined, uom.referenceId, uom.languageId)
    }
    else {
      this.edit(undefined, uom.id, uom.languageId)
    }
  }
}
