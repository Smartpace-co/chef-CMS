import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageSchoolService } from '../../services/manage-school.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import * as _ from 'lodash';
import { School } from '../../_model/school.model';
import {ToastrService} from 'ngx-toastr'
import { ManageDistrictAdminService } from 'src/app/modules/manage-district-admins/services/manage-districtAdmin.service';

declare var Stripe;

const EMPTY_SCHOOL_ADMIN: School = {
  id: undefined,
  district_id: 0,
  name: '',
  admin_account_name: '',
  email: '',
  contact_person_email: '',
  package_id: 0,
  contact_person_name: '',
  contact_person_number: '',
  phone_number: '',
  emergency_contact_number: '',
  role_id: 0,
  status: true,
  isSendPaymentLink: true
}
@Component({
  selector: 'app-edit-school-modal',
  templateUrl: './edit-school-modal.component.html',
  styleUrls: ['./edit-school-modal.component.scss']
})
export class EditSchoolModalComponent implements OnInit {
  @Input() id: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  school: School;
  formGroup: FormGroup;
  activateUserData: any;
  packageId: number;
  queryParamObj;
  packageMaster = [];
  districtMaster: any;
  activePackage:any;

  allPackages = [];
  stripe: any;
  isParams = false;
  token: string;
  roleID: number;
  guestToken: any;
  schoolDetail: any;
  districtDetail: any;

  constructor(
    public schoolService: ManageSchoolService,
    public districtAdminService: ManageDistrictAdminService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    private actRoute: ActivatedRoute,
    private toast:ToastrService

  ) {
    if (this.actRoute.snapshot && this.actRoute.snapshot.queryParams) {
      let queryString = Object.keys(this.actRoute.snapshot.queryParams)[0];
      if (queryString) {
        this.queryParamObj = this.schoolService.queryParamsToJSON(queryString);
        this.isParams = true;
      }
    }
  }

  ngOnInit(): void {
    this.stripe = Stripe(environment.public_key);
    this.isLoading$ = this.schoolService.isLoading$;
    this.getDistrictList();
    this.loadSchoolAdmin();
    this.getRoleList();
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      customDistrictName: [""],
      name: ["", Validators.compose([Validators.required])],
      status: [true, Validators.compose([Validators.required])],
      admin_account_name: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z \-\']+')])],
      email: ["", Validators.compose([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])],
      contact_person_email: ["", Validators.compose([Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])],
      contact_person_name: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z \-\']+')])],
      contact_person_number: ["", Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),this.validContactPersonNumber.bind(this)])],
      phone_number: ["", Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),this.validPhoneNumber.bind(this)])],
      emergency_contact_number: ["", Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])[- +()0-9]+$')])],
      package_id: ["", Validators.compose([Validators.required])],
    });
    // this.stripe = Stripe(environment.public_key);

  }

  getRoleList() {
    this.schoolService.getAllMasterRoleDetails().subscribe(
      (res) => {
        if (res && res.data) {
          for (let role of res.data) {
            if (role.title == 'School')
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
      this.schoolService.getAllPackageList(isPrivate, this.token, this.packageId, customElements, this.roleID).subscribe(
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
  getDistrictList(): void {
    this.schoolService.getAllDistricts().subscribe((districts: any) => {
      this.districtMaster = districts.data;
    });

  }

  loadSchoolAdmin() {

    if (this.id) {
      this.guestToken = JSON.parse(window.sessionStorage.getItem('v717demo1-authf649fc9a5f55'));
      this.schoolService.getSchoolProfile(this.id, this.guestToken.token).subscribe((schoolAdmin: any) => {
        this.schoolDetail = schoolAdmin.data;
        if (this.schoolDetail) {
          this.getActivePackage(this.schoolDetail)

        }


      });
    }
  }

  getActivePackage(schoolDetail) {
    this.schoolService.getActiveSubscribePackageDetails(schoolDetail.school.user_id).subscribe(res => {
      
      if (res && res.data) {
        this.activePackage=res.data.packageId;
        if(this.schoolDetail.district_details!=null){
          this.formGroup.controls['customDistrictName'].disable()
          this.districtDetail=this.schoolDetail.district_details.name
        }
        else
        {
          this.districtDetail=this.schoolDetail.school.customDistrictName
        }
        this.validationService.formGroupDef = this.formGroup = this.fb.group({
          customDistrictName: [ this.districtDetail],
          name: [this.schoolDetail.school.name, Validators.compose([Validators.required])],
          status: [this.schoolDetail.status, Validators.compose([Validators.required])],
          admin_account_name: [this.schoolDetail.school.admin_account_name, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z \-\']+')])],
          email: [this.schoolDetail.email, Validators.compose([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])],
          contact_person_email: [this.schoolDetail.school.contact_person_email, Validators.compose([Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])],
          contact_person_name: [this.schoolDetail.school.contact_person_name, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z \-\']+')])],
          contact_person_number: [this.schoolDetail.school.contact_person_number, Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])[- +()0-9]+$')])],
          phone_number: [this.schoolDetail.phone_number, Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])[- +()0-9]+$')])],
          emergency_contact_number: [this.schoolDetail.school.emergency_contact_number, Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])[- +()0-9]+$')])],
          package_id: [res.data.packageId, Validators.compose([Validators.required])]

        });

      }
      else
      {
        this.validationService.formGroupDef = this.formGroup = this.fb.group({
          customDistrictName: [this.schoolDetail.district_details.name, Validators.compose([Validators.required])],
          name: [this.schoolDetail.school.name, Validators.compose([Validators.required])],
          status: [this.schoolDetail.status, Validators.compose([Validators.required])],
          admin_account_name: [this.schoolDetail.school.admin_account_name, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z \-\']+')])],
          email: [this.schoolDetail.email, Validators.compose([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])],
          contact_person_email: [this.schoolDetail.school.contact_person_email, Validators.compose([Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])],
          contact_person_name: [this.schoolDetail.school.contact_person_name, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z \-\']+')])],
          contact_person_number: [this.schoolDetail.school.contact_person_number, Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])[- +()0-9]+$')])],
          phone_number: [this.schoolDetail.phone_number, Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])[- +()0-9]+$')])],
          emergency_contact_number: [this.schoolDetail.school.emergency_contact_number, Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])[- +()0-9]+$')])],
          package_id: ['', Validators.compose([Validators.required])]

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
    this.guestToken = JSON.parse(window.sessionStorage.getItem('v717demo1-authf649fc9a5f55'));
    let submission={
      customDistrictName: this.formGroup.value.customDistrictName,
      name: this.formGroup.value.name,
      status: this.formGroup.value.status,
      admin_account_name: this.formGroup.value.admin_account_name,
      email: this.formGroup.value.email,
      contact_person_email:this.formGroup.value.contact_person_email,
      contact_person_name: this.formGroup.value.contact_person_name,
      contact_person_number: this.formGroup.value.contact_person_number,
      phone_number: this.formGroup.value.phone_number,
      emergency_contact_number: this.formGroup.value.emergency_contact_number,
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
    const sbUpdate = this.schoolService.updateSchoolProfile(submission,this.schoolDetail.id,this.guestToken.token).pipe(
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
        return of(this.school);
      }),
    ).subscribe(res => this.school = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.guestToken=window.sessionStorage.getItem('v717demo1-authf649fc9a5f55')
        const formData = this.formGroup.value;
        formData.role_id = this.roleID;
        formData.isSendPaymentLink = true;
         const sbCreate = this.schoolService.registerSchoolAdmin(formData,this.guestToken.token).pipe(
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
            return of(this.school);
          }),
        ).subscribe((res: School) => this.school = res);
        this.subscriptions.push(sbCreate);
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
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
