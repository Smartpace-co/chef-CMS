import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DeleteManyModalComponent } from 'src/app/_metronic/shared/components/delete-many-modal/delete-many-modal.component';
import { DeleteModalComponent } from 'src/app/_metronic/shared/components/delete-modal/delete-modal.component';
import { UpdateStatusModalComponent } from 'src/app/_metronic/shared/components/update-status-modal/update-status-modal.component';
import { ICreateAction, ITableState, IEditAction, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IUpdateStatusForSelectedAction, ISortView, IFilterView, IGroupingView, ISearchView, PaginatorState, SortState, GroupingState } from 'src/app/_metronic/shared/crud-table';
import { UpdateRoleStatusModalComponent } from '../manage-role/components/update-role-status-modal/update-role-status-modal.component';
import { EditSubjectModalComponent } from './components/edit-subject-modal/edit-subject-modal.component';
import { SubjectServices } from './services/manage-subjects.service';

@Component({
  selector: 'app-manage-subjects',
  templateUrl: './manage-subjects.component.html',
  styleUrls: ['./manage-subjects.component.scss']
})
export class ManageSubjectsComponent implements OnInit,
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
  tableState: ITableState;
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
    public subjectService: SubjectServices
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.loadLanguage();
    this.filterForm();
    this.searchForm();
    this.subjectService.fetch();
    this.grouping = this.subjectService.grouping;
    this.paginator = this.subjectService.paginator;
    this.sorting = this.subjectService.sorting;
    const sb = this.subjectService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // Load system languages
  loadLanguage() {
    this.subjectService.getLanguageList().subscribe((res) => {
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
    this.subjectService.patchState({ filter });
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
    this.subjectService.patchState({ searchTerm });
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
    this.subjectService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.subjectService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number, referenceId?: number, languageId?: number) {
    const modalRef = this.modalService.open(EditSubjectModalComponent);
    if (referenceId) {
      modalRef.componentInstance.refId = referenceId;
    }
    if (languageId) {
      modalRef.componentInstance.languageId = languageId;
    }
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.subjectService.fetch(),
      () => { }
    );
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.service = this.subjectService;
    modalRef.componentInstance.fileName = 'Subject';
    modalRef.result.then(() => this.subjectService.fetch(), () => { });
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteManyModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.service = this.subjectService;
    modalRef.componentInstance.fileName = 'Subject';
    modalRef.result.then(() => this.subjectService.fetch(), () => { });
  }

  updateStatusForSelected() {
    const modalRef = this.modalService.open(UpdateStatusModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.tableName = 'Subject';
    modalRef.componentInstance.tableinfo = this.subjectService.items$;
    modalRef.componentInstance.serviceName = this.subjectService;
    modalRef.componentInstance.columnName = 'SubjectTitle';
    modalRef.result.then(() => this.subjectService.fetch(), () => { });
  }

  fetchSelected() {
    const modalRef = this.modalService.open(UpdateStatusModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.tableName = 'Subject';
    modalRef.componentInstance.tableinfo = this.subjectService.items$;
    modalRef.componentInstance.serviceName = this.subjectService;
    modalRef.componentInstance.columnName = 'SubjectTitle';
    modalRef.result.then(() => this.subjectService.fetch(), () => { });
  }

  changeLanguage(e) {
    let languageId = e.target.value;
    if (languageId == "null") {
      this.subjectService.fetch();
    } else {
      this.subjectService.fetchByLanguage(languageId);
    }
  }

  addSubject(subject) {
    if (subject.referenceId) {
      this.edit(undefined, subject.referenceId, subject.languageId)
    }
    else {
      this.edit(undefined, subject.id, subject.languageId)
    }
  }
}
