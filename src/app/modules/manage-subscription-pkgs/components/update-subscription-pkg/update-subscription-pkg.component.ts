import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbActiveModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { SubscriptionPkgsService } from '../../services/subscription-pkgs.service';
import { SubscriptionPkgs } from '../../_models/subscription_pkg.model';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { CustomRegex } from 'src/app/_metronic/core/validators/custom-regex'
import { ManageLessonsService } from 'src/app/modules/manage-lessons/services/manage-lessons.service';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import {ToastrService} from 'ngx-toastr'

const EMPTY_PKG: any = {
  id: null,
  packageTitle: '',
  description:'',
  packageFor: 1,
  validityFrom: 0,
  validityTo: 0,
  maxUser: 0,
  isPrivate:false,
  price: 0,
  gracePeriod: 0,
  status: true,
};

@Component({
  selector: 'app-update-subscription-pkg',
  templateUrl: './update-subscription-pkg.component.html',
  styleUrls: ['./update-subscription-pkg.component.scss'],

})
export class UpdateSubscriptionPkgComponent implements OnInit {
  @Input() id: number;
  isLoading$;
  subscriptionPkgs: any;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  //gradeMaster: any = [];
  lessonsMaster: any = []
  roleMaster: any = [];
  minDate = undefined;
  isShareableLink: boolean = false;
  isCopied: boolean = false;
  fromDateObject: any;
  toDateObject: any;
  selectedFromDate: any;
  selectedToDate: any;
  maxLabel: string="Maximum User";
  monthMaster=[
    {id:1,title:'January'},
    {id:2,title:'February'},
    {id:3,title:'March'},
    {id:4,title:'April'},
    {id:5,title:'May'},
    {id:6,title:'June'},
    {id:7,title:'July'},
    {id:8,title:'August'},
    {id:9,title:'September'},
    {id:10,title:'October'},
    {id:11,title:'November'},
    {id:12,title:'December'}
  ]
  editable: boolean=false;
  constructor(
    private subscriptionPkgsService: SubscriptionPkgsService, private lessonService: ManageLessonsService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    private config: NgbDatepickerConfig,
    private _clipboardService: ClipboardService,
    private toast:ToastrService

  ) {
    /* const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    }; */

  }

  ngOnInit(): void {
    this.isLoading$ = this.subscriptionPkgsService.isLoading$;
    this.loadMaster();
    this.loadCustomer();

  }

  loadMaster() {
    const sb1 = this.subscriptionPkgsService.loadMasterRole().pipe(
      first(),
      catchError((errorMessage) => {
        console.log(errorMessage)
        return of(EMPTY_PKG);
      })
    ).subscribe((response: any) => {
      this.roleMaster = response
    });
    // this.subscriptions.push(sb);
    this.subscriptions.push(sb1);


  }

  loadCustomer() {
    if (!this.id) {
      this.subscriptionPkgs ={
        id: null,
        packageTitle: '',
        description:'',
        packageFor: 1,
        validityFrom: null,
        validityTo: null,
        maxUser: 0,
        isPrivate:false,
        price: 0,
        gracePeriod: 0,
        status: true,
      };
      this.loadForm();
    } else {
      const sb = this.subscriptionPkgsService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_PKG);
        })
      ).subscribe((subPkg: any) => {
        this.subscriptionPkgs = subPkg.data;
        this.loadForm();

      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      title: [this.subscriptionPkgs.packageTitle, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      description: [this.subscriptionPkgs.description],
      packageFor: [this.subscriptionPkgs.packageFor, Validators.compose([Validators.required])],
      validityFrom: [this.subscriptionPkgs.validityFrom,Validators.compose([Validators.required])],
      validityTo: [this.subscriptionPkgs.validityTo,Validators.compose([Validators.required])],
      maximumUsers: [this.subscriptionPkgs.maxUser, Validators.compose([Validators.pattern(CustomRegex.numbersOnly),Validators.min(1)])],
      price: [this.subscriptionPkgs.price, Validators.compose([Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),Validators.min(1)])],
      gracePeriod: [this.subscriptionPkgs.gracePeriod, Validators.compose([Validators.pattern(CustomRegex.numbersOnly),Validators.min(1)])],
      status: [this.subscriptionPkgs.status],
      isPrivate: [this.subscriptionPkgs.isPrivate],
      shareableLink: [this.subscriptionPkgs.shareableLink],
    });

    let role=this.roleMaster.find((res)=>res.id==this.subscriptionPkgs.packageFor)
    if(role){
      this.changePackageFor(role);
    }
    if(this.subscriptionPkgs.id){
      this.formGroup.controls['packageFor'].disable()
      this.formGroup.controls['validityFrom'].disable()
      this.formGroup.controls['validityTo'].disable()
      this.formGroup.controls['maximumUsers'].disable()
      this.formGroup.controls['price'].disable()
      this.formGroup.controls['gracePeriod'].disable()
      this.formGroup.controls['isPrivate'].disable()

    }
  }

  changePackageFor(item){
    if(item.title=="School" || item.title=="District"){
      this.maxLabel="Maximum Classes";
    }
    else{
      this.maxLabel="Maximum Students";
    }
  }

  changePackageType(e) {
    if (e == "false") {
      this.subscriptionPkgs.isPrivate = false;
    }
    else {
      this.subscriptionPkgs.isPrivate = true;
    }
  }
  save() {
    this.prepareCustomer();
    if (this.subscriptionPkgs.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  copyShareableLink() {
    this._clipboardService.copyFromContent(this.formGroup.controls['shareableLink'].value);
    this.isCopied = true

  }


  edit() {
    delete this.subscriptionPkgs.shareableLink;
    const sbUpdate = this.subscriptionPkgsService.update(this.subscriptionPkgs).pipe(
      tap((res:any) => {
        if(res.status==200){
          this.toast.success(res.message,"Success");
        }
        else if(res.status==409){
          this.toast.error(res.message,"Error");
        }
        else{
          this.toast.error("Something went wrong","Error");
        }
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.subscriptionPkgs);
      }),
    ).subscribe(res => this.subscriptionPkgs = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.subscriptionPkgsService.create(this.subscriptionPkgs).pipe(
      tap((res:any) => {
        if(res.status==200){
          this.toast.success(res.message,"Success");
        }
        else if(res.status==409){
          this.toast.error(res.message,"Error");
        }
        else{
          this.toast.error("Something went wrong","Error");
        }
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.subscriptionPkgs);
      }),
    ).subscribe((res: SubscriptionPkgs) => this.subscriptionPkgs = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.subscriptionPkgs.packageTitle = formData.title;
    this.subscriptionPkgs.description = formData.description;
    this.subscriptionPkgs.status = formData.status;
   // let fromDate = formData.validityFrom.year + '-' + formData.validityFrom.month + '-' + formData.validityFrom.day
    this.subscriptionPkgs.validityFrom = formData.validityFrom;
  //  let toDate = formData.validityTo.year + '-' + formData.validityTo.month + '-' + formData.validityTo.day
    this.subscriptionPkgs.validityTo = formData.validityTo;
    this.subscriptionPkgs.maxUser = formData.maximumUsers;
    this.subscriptionPkgs.packageFor = formData.packageFor;
    this.subscriptionPkgs.price = formData.price;
    this.subscriptionPkgs.isPrivate = formData.isPrivate;
    this.subscriptionPkgs.gracePeriod = formData.gracePeriod;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
