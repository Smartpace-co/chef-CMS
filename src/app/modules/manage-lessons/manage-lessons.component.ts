import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DeleteManyModalComponent } from 'src/app/_metronic/shared/components/delete-many-modal/delete-many-modal.component';
import { DeleteModalComponent } from 'src/app/_metronic/shared/components/delete-modal/delete-modal.component';
import { UpdateStatusModalComponent } from 'src/app/_metronic/shared/components/update-status-modal/update-status-modal.component';
import { ICreateAction, IEditAction, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IUpdateStatusForSelectedAction, ISortView, IFilterView, IGroupingView, ISearchView, PaginatorState, SortState, GroupingState } from 'src/app/_metronic/shared/crud-table';
import { ManageLessonsService } from './services/manage-lessons.service';
import {ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-manage-lessons',
  templateUrl: './manage-lessons.component.html',
  styleUrls: ['./manage-lessons.component.scss']
})
export class ManageLessonsComponent implements OnInit, OnDestroy,
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
  fileInputLabel: any;
  languageMaster = [];
  gradeId:any;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public lessonService: ManageLessonsService,
    private router: Router,
    private toast:ToastrService,
    private route: ActivatedRoute,
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.route.params.subscribe(res => this.gradeId = res ? res.id : undefined)
    this.loadLanguage();
    this.filterForm();
    this.searchForm();
   // this.lessonService.fetch();
    this.lessonService.fetchLessonByFilter(this.gradeId,'gradeId');
    this.grouping = this.lessonService.grouping;
    this.paginator = this.lessonService.paginator;
    this.sorting = this.lessonService.sorting;
    const sb = this.lessonService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // Load system languages
  loadLanguage() {
    this.lessonService.getLanguageList().subscribe((res) => {
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
    this.lessonService.patchStateForLesson({ filter },this.gradeId);
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
    this.lessonService.patchState({ searchTerm });
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
    this.lessonService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.lessonService.patchStateForLesson({ paginator },this.gradeId);
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number, referenceId?: number, languageId?: number) {
    this.router.navigateByUrl('manage-lessons/old/' + id);
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.service = this.lessonService;
    modalRef.componentInstance.fileName = 'Lesson';
    modalRef.result.then(() => this.lessonService.fetchLessonByFilter(this.gradeId,'gradeId'), () => { });
  }

  hardDelete(id: number) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.service = this.lessonService;
    modalRef.componentInstance.fileName = 'Lesson';
    modalRef.componentInstance.action= "HardDelete"
    modalRef.result.then(() => this.lessonService.fetchLessonByFilter(this.gradeId,'gradeId'), () => { });
  }

  restore(id: number){
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.action= "Restore"
    modalRef.componentInstance.service = this.lessonService;
    modalRef.componentInstance.fileName = 'Lesson';
    modalRef.result.then(() => this.lessonService.fetchLessonByFilter(this.gradeId,'gradeId'), () => { });

  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteManyModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.service = this.lessonService;
    modalRef.componentInstance.fileName = 'Lesson';
    modalRef.result.then(() => this.lessonService.fetch(), () => { });
  }

  updateStatusForSelected() {
    const modalRef = this.modalService.open(UpdateStatusModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.tableName = 'Lesson';
    modalRef.componentInstance.tableinfo = this.lessonService.items$;
    modalRef.componentInstance.serviceName = this.lessonService;
    modalRef.componentInstance.columnName = 'lessonTitle';
    modalRef.result.then(() => this.lessonService.fetch(), () => { });
  }

  fetchSelected() {
    const modalRef = this.modalService.open(UpdateStatusModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.componentInstance.tableName = 'Lesson';
    modalRef.componentInstance.tableinfo = this.lessonService.items$;
    modalRef.componentInstance.serviceName = this.lessonService;
    modalRef.componentInstance.columnName = 'lessionName';
    modalRef.result.then(() => this.lessonService.fetch(), () => { });
  }

  changeLanguage(e) {
    let languageId = e.target.value;
    if (languageId == "null") {
      this.lessonService.fetchByLanguage(languageId);
    } else {
      this.lessonService.fetchByLanguage(languageId);
    }
  }

  addLesson(lesson) {
      this.lessonService.setlessonData(lesson);
      this.router.navigateByUrl('/manage-lessons/new/');
  } 
}
