import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, Subscription } from "rxjs";
import { ManageLessonsService } from "../../services/manage-lessons.service";
import { catchError, first, tap } from "rxjs/operators";
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { Router } from '@angular/router';

const EMPTY_LINK_FORM: any = {
  links:[]
}

@Component({
  selector: 'app-link-form',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.scss']
})
export class LinkFormComponent implements OnInit {
  @Input() id: number;
  @Input() activeTabId: number;
  @Input() previousStepName;
  @Input() nextStepName;
  @Input() tabs;
  @Input() lessonId;
  @Output() changeActiveTab: EventEmitter<number> = new EventEmitter<number>();

  isLoading$;
  private subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  data: any;

  constructor(
    private fb: FormBuilder,
    public validationService: FormValidationServices,
    private lessonService: ManageLessonsService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.lessonService.isLoading$;
    this.loadLinkForm();

  }
  
  loadLinkForm() {
    if (!this.lessonId) {
      this.data = EMPTY_LINK_FORM;
      this.loadForm();
    } else {
    
      const sb = this.lessonService
        .getItemById(this.lessonId)
        .pipe(
          first(),
          catchError((errorMessage) => {
            return of(EMPTY_LINK_FORM);
          })
        )
        .subscribe((dt: any) => {
          this.data = dt.data ? dt.data : EMPTY_LINK_FORM;
        
          this.loadForm();
        });
      this.subscriptions.push(sb);
    }
    }

    loadForm() {
      this.validationService.formGroupDef = this.formGroup = this.fb.group({
        links: this.fb.array([]),
      });
      if (this.data?.links.length > 0) {
        this.data.links.forEach(e => {
          this.addQuantity(e);
        })
      } else {
        this.addQuantity(undefined)
      }
    
    }
  
    // load link as a form array 
    linkNames(): FormArray {
    return this.formGroup.get("links") as FormArray
  }

  // create a link function pushed the group in link form array
  addQuantity(data) {
    this.linkNames().push(this.newLinkName(data));
  }

  // form froup of link array methods
  newLinkName(data): FormGroup {
    if (data == undefined) {
      return this.fb.group({
        videoLink: [data],
      })
    }
    return this.fb.group({
      id: [data.id],
      videoLink: [data.videoLink],
    })
  }

  // remove link using a index
  removeQuantity(i: number) {
    this.linkNames().removeAt(i);
  }


  onSave() {
    if (this.lessonId) {
      this.edit();
    }
    // else {
    //   this.create();
    // }
  }
  
  edit() {
    const formData = this.formGroup.value;
    if(formData.links.length>0){
     var filtered= formData.links.filter(element => {
          return (element.videoLink!='' && element.videoLink!=null);  
      });
    }else{
      filtered=[];
    }
    let data = {
      id: this.lessonId,
      links: filtered
    }
    const sbUpdate = this.lessonService.update(data).pipe(
      tap(() => {
        //this.changeTab(this.nextStepName);
        this.router.navigateByUrl('/manage-lessons/');
      }),
      catchError((errorMessage) => {
        return of(this.data);
      }),
    ).subscribe(res => this.data = res);
    this.subscriptions.push(sbUpdate);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
    this.changeActiveTab.emit(tabId);
  }

}
