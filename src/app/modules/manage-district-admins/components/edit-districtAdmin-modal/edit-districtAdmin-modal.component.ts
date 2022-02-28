import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageDistrictAdminService } from '../../services/manage-districtAdmin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import * as _ from 'lodash';
import { DistrictAdmin } from '../../_model/districtAdmin.model';
import { ToastrService } from 'ngx-toastr';
declare var Stripe;

const EMPTY_DISTRICT_ADMIN: DistrictAdmin = {
  id: undefined,
  name: '',
  admin_account_name: '',
  email: '',
  contact_person_email: '',
  package_id: 0,
  contact_person_name: '',
  contact_person_no: '',
  phone_number: '',
  role_id: 0,
  status: true,
  isSendPaymentLink: true
}
@Component({
  selector: 'app-edit-districtAdmin-modal',
  templateUrl: './edit-districtAdmin-modal.component.html',
  styleUrls: ['./edit-districtAdmin-modal.component.scss']
})
export class EditDistrictAdminModalComponent implements OnInit {
  @Input() id: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  districtAdmin: DistrictAdmin;
  formGroup: FormGroup;
  activateUserData: any;
  packageId: number;
  queryParamObj;
  packageMaster = [];
  packageDetails:any;
  allPackages = [];
  stripe: any;
  isParams = false;
  token: string;
  roleID: number;
  guestToken: any;
  activePackage:any;
  districtAdminDetail: any;
  constructor(
    public districtAdminService: ManageDistrictAdminService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    private actRoute: ActivatedRoute,
    private toast:ToastrService

  ) {
    if (this.actRoute.snapshot && this.actRoute.snapshot.queryParams) {
      let queryString = Object.keys(this.actRoute.snapshot.queryParams)[0];
      if (queryString) {
        this.queryParamObj = this.districtAdminService.queryParamsToJSON(queryString);
        this.isParams = true;
      }
    }
  }

  ngOnInit(): void {
    this.stripe = Stripe(environment.public_key);
    this.isLoading$ = this.districtAdminService.isLoading$;
    this.getRoleList();
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      name: ["", Validators.compose([Validators.required])],
      status: [true, Validators.compose([Validators.required])],
      admin_account_name: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z \-\']+')])],
      email: ["", Validators.compose([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])],
      contact_person_email: ["", Validators.compose([Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])],
      contact_person_name: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z \-\']+')])],
      contact_person_no: ["", Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10), this.validContactPersonNumber.bind(this)])],
      phone_number: ["", Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),this.validPhoneNumber.bind(this)])],
      package_id: ["", Validators.compose([Validators.required])],
    });
    this.loadDistrictAdmin();
  }

  getRoleList() {
    this.districtAdminService.getAllMasterRoleDetails().subscribe(
      (res) => {
        if (res && res.data) {
          for (let role of res.data) {
            if (role.title == 'District')
              this.roleID = role.id;


          }
          if (this.roleID) {
            this.getPackageList();
          }
        }
      });
  }
  getPackageList(): void {
    this.packageId = this.queryParamObj && this.queryParamObj.packageId ? parseInt(this.queryParamObj.packageId) : undefined;
    let isPrivate = this.packageId ? true : false;
    let activateUserData = JSON.parse(window.sessionStorage.getItem('v717demo1-authf649fc9a5f55'));
    this.token = activateUserData.token;
    if (this.token) {
      this.districtAdminService.getAllPackageList(isPrivate, this.token, this.packageId, customElements, this.roleID).subscribe(
        (res) => {
          if (res && res.data) {
            if (_.isArray(res.data)) {
              this.packageMaster = res.data;
            } else {
              this.packageMaster = [res.data];
            }
          }

        })
    }

  }

  loadDistrictAdmin() {
    if (this.id) {
      this.guestToken = window.sessionStorage.getItem('v717demo1-authf649fc9a5f55')
      this.districtAdminService.getDistrictProfile(this.id, this.guestToken.token).subscribe((districtAdmin: any) => {
        this.districtAdminDetail = districtAdmin.data;
        if(this.districtAdminDetail)
        {
          this.getActivePackage(this.districtAdminDetail)
        }
       
      });

  

    }


  }

  getActivePackage(districtAdminDetail){
    this.districtAdminService.getActiveSubscribePackageDetails(districtAdminDetail.district_admin.user_id).subscribe(res=>{
      if(res && res.data){
        this.activePackage=res.data.packageId;
        this.validationService.formGroupDef = this.formGroup = this.fb.group({
          name: [this.districtAdminDetail.district_admin.name, Validators.compose([Validators.required])],
          status: [this.districtAdminDetail.status, Validators.compose([Validators.required])],
          admin_account_name: [this.districtAdminDetail.district_admin.admin_account_name, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z \-\']+')])],
          email: [this.districtAdminDetail.email, Validators.compose([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])],
          contact_person_email: [this.districtAdminDetail.district_admin.contact_person_email, Validators.compose([Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])],
         contact_person_name: [this.districtAdminDetail.district_admin.contact_person_name, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z \-\']+')])],
          contact_person_no: [this.districtAdminDetail.district_admin.contact_person_no, Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])[- +()0-9]+$')])],
          phone_number: [this.districtAdminDetail.phone_number, Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])[- +()0-9]+$')])],
          package_id: [res.data.packageId, Validators.compose([Validators.required])]
        });
        
      }
    });
  }
  

  save() {

    if (this.id) {
      this.edit();
    } else {

      this.create();
    }
  }
  
  edit() {
    this.guestToken = window.sessionStorage.getItem('v717demo1-authf649fc9a5f55')
    let submission={
          name:this.formGroup.value.name,
          status:this.formGroup.value.status,
          admin_account_name: this.formGroup.value.admin_account_name,
          email: this.formGroup.value.email,
          contact_person_email: this.formGroup.value.contact_person_email,
          contact_person_name: this.formGroup.value.contact_person_name,
          contact_person_no: this.formGroup.value.contact_person_no,
          phone_number: this.formGroup.value.phone_number,
          package_id:this.formGroup.value.package_id,
          isSendPaymentLink:true
    }
   /* if(this.formGroup.value.package_id!=this.activePackage){
      submission["isSendPaymentLink"]=true

    }
    else
    {
      submission["isSendPaymentLink"]=false
      this.toast.error("You can't select same package","Error");
    }*/
    const sbUpdate = this.districtAdminService.updateDistrictProfile(submission, this.districtAdminDetail.id, this.guestToken.token).pipe(
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
        return of(this.districtAdmin);
      }),
    ).subscribe(res => this.districtAdmin = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.guestToken = window.sessionStorage.getItem('v717demo1-authf649fc9a5f55')
    const formData = this.formGroup.value;
    formData.role_id = this.roleID;
    formData.isSendPaymentLink = true;
    const sbCreate = this.districtAdminService.registerDistrictAdmin(formData, this.guestToken.token).pipe(
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
        return of(this.districtAdmin);
      }),
    ).subscribe( (dt: any) => {
      this.districtAdmin = dt
  });
    this.subscriptions.push(sbCreate);
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  validPhoneNumber(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match('^(?=.*[0-9])[- +()0-9]+$');
      if (control.value && control.value.length === 11 || control.value.length > 13) {
        return { 'contactDigitValidate': true }
      }
      if (isValid && isValid.input) {
        this.districtAdminService.contactValidator(control.value).subscribe(
          (data) => {
          },
          (error) => {
            console.log(error);
            this.formGroup.controls['phone_number'].setErrors({ 'contactValidate': true });
          }
        );
      }
    }
  }

  /**
 * To check valid phone number for contact person.
 *   
 */
  validContactPersonNumber(control: AbstractControl): any {
    if (control.value && control.value.length === 11 || control.value.length > 13) {
      return { 'digitValidate': true }
    }
  }
}
