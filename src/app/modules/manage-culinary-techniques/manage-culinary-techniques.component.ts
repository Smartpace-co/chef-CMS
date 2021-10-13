import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DeleteManyModalComponent } from 'src/app/_metronic/shared/components/delete-many-modal/delete-many-modal.component';
import { DeleteModalComponent } from 'src/app/_metronic/shared/components/delete-modal/delete-modal.component';
import { UpdateStatusModalComponent } from 'src/app/_metronic/shared/components/update-status-modal/update-status-modal.component';
import { ICreateAction, IEditAction, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IUpdateStatusForSelectedAction, ISortView, IFilterView, IGroupingView, ISearchView, PaginatorState, SortState, GroupingState } from 'src/app/_metronic/shared/crud-table';
import { EditCulinaryTechniquesModalComponent } from './components/edit-culinary-techniques-modal/edit-culinary-techniques-modal.component';
import { ManageCulinaryTechniquesService } from './service/manage-culinary-techniques.service';

@Component({
  selector: 'app-manage-culinary-techniques',
  templateUrl: './manage-culinary-techniques.component.html',
  styleUrls: ['./manage-culinary-techniques.component.scss']
})
export class ManageCulinaryTechniquesComponent implements OnInit, OnDestroy,
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
    public culinaryTechniqueService: ManageCulinaryTechniquesService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.loadLanguage();
    this.filterForm();
    this.searchForm();
    this.culinaryTechniqueService.fetch();
    this.grouping = this.culinaryTechniqueService.grouping;
    this.paginator = this.culinaryTechniqueService.paginator;
    this.sorting = this.culinaryTechniqueService.sorting;
    const sb = this.culinaryTechniqueService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

    // Load system languages
    loadLanguage() {
      this.culinaryTechniqueService.getLanguageList().subscribe((res) => {
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
    this.culinaryTechniqueService.patchState({ filter });
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
    this.culinaryTechniqueService.patchState({ searchTerm });
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
    this.culinaryTechniqueService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.culinaryTechniqueService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number, referenceId?: number, languageId?: number) {
    const modalRef = this.modalService.open(EditCulinaryTechniquesModalComponent, { size: 'xl' });
    if (referenceId) {
      modalRef.componentInstance.refId = referenceId;
    }
    if (languageId) {
      modalRef.componentInstance.languageId = languageId;
    }
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.culinaryTechniqueService.fetch(),
      () => { }
    );
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.service = this.culinaryTechniqueService;
    modalRef.componentInstance.fileName = 'Culinary Techniques';
    modalRef.result.then(() => this.culinaryTechniqueService.fetch(), () => { });
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteManyModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.service = this.culinaryTechniqueService;
    modalRef.componentInstance.fileName = 'Culinary Techniques';
    modalRef.result.then(() => this.culinaryTechniqueService.fetch(), () => { });
  }

  updateStatusForSelected() {
    const modalRef = this.modalService.open(UpdateStatusModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.tableName = 'Culinary Techniques';
    modalRef.componentInstance.tableinfo = this.culinaryTechniqueService.items$;
    modalRef.componentInstance.serviceName = this.culinaryTechniqueService;
    modalRef.componentInstance.columnName = 'culinaryTechniqueName';
    modalRef.result.then(() => this.culinaryTechniqueService.fetch(), () => { });
  }

  fetchSelected() {
    const modalRef = this.modalService.open(UpdateStatusModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.tableName = 'Culinary Techniques';
    modalRef.componentInstance.tableinfo = this.culinaryTechniqueService.items$;
    modalRef.componentInstance.serviceName =  this.culinaryTechniqueService;
    modalRef.componentInstance.columnName = 'culinaryTechniqueName';
    modalRef.result.then(() => this.culinaryTechniqueService.fetch(), () => { });
  }
  changeLanguage(e) {
    let languageId = e.target.value;
    if (languageId == "null") {
      this.culinaryTechniqueService.fetch();
    } else {
      this.culinaryTechniqueService.fetchByLanguage(languageId);
    }
  }

  addTechnique(technique) {
    if (technique.referenceId) {
      this.edit(undefined, technique.referenceId, technique.languageId)
    }
    else {
      this.edit(undefined, technique.id, technique.languageId)
    }
  }
}
