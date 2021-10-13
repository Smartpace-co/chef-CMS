import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageUnitOfMeasureService } from '../../service/unitOfMesurement.service';
import { UnitOfMeasurement } from '../../_model/manage-unit-of-measurement.model';

const EMPTY_UNITOFMESURE: UnitOfMeasurement = {
  id: undefined,
  unitOfMeasure: '',
  description: '',
  status: true
}
@Component({
  selector: 'app-edit-units-of-measurement-modal',
  templateUrl: './edit-units-of-measurement-modal.component.html',
  styleUrls: ['./edit-units-of-measurement-modal.component.scss']
})
export class EditUnitsOfMeasurementModalComponent implements OnInit {

  @Input() id: number;
  @Input() refId: number;
  @Input() languageId: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  unitOfMeasurement: any;
  formGroup: FormGroup;
  languageMaster=[];

  constructor(
    private unitOfMeasurementService: ManageUnitOfMeasureService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.unitOfMeasurementService.isLoading$;
    if(this.refId){
      this.unitOfMeasurementService.getLanguageListByFilter('unit_of_measurements',this.refId).subscribe((res)=>{
        this.languageMaster=res.data;
      },(e)=>{
        console.log(e)
      })
    }else{
      this.loadLanguage()
    }
    this.loadSubject();
  }

 // Load system languages
 loadLanguage(){
  this.unitOfMeasurementService.getLanguageList().subscribe((res)=>{
    this.languageMaster=res.data;
  },(e)=>{
    console.log(e)
  })
}

  loadSubject() {
    if (!this.id) {
      //this.unitOfMeasurement = EMPTY_UNITOFMESURE;
      this.unitOfMeasurement={
        id: undefined,
        unitOfMeasure: '',
        description: '',
        status: true
      }
      this.loadForm();
    } else {
      const sb = this.unitOfMeasurementService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_UNITOFMESURE);
        })
      ).subscribe((unitOfMeasure: any) => {
        this.unitOfMeasurement = unitOfMeasure.data;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      unitOfMeasure: [this.unitOfMeasurement.unitOfMeasure, Validators.compose([Validators.required])],
      status: [this.unitOfMeasurement.status, Validators.compose([Validators.required])],
      description: [this.unitOfMeasurement.description, Validators.compose([Validators.required])],
      languageId:[this.unitOfMeasurement.systemLanguageId],
    });
  }

  save() {
    this.prepareCustomer();
    if (this.unitOfMeasurement.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.unitOfMeasurementService.update(this.unitOfMeasurement).pipe(
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
        return of(this.unitOfMeasurement);
      }),
    ).subscribe(res => this.unitOfMeasurement = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.unitOfMeasurementService.create(this.unitOfMeasurement).pipe(
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
        return of(this.unitOfMeasurement);
      }),
    ).subscribe((res: UnitOfMeasurement) => this.unitOfMeasurement = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.unitOfMeasurement.unitOfMeasure = formData.unitOfMeasure;
    this.unitOfMeasurement.status = formData.status;
    this.unitOfMeasurement.description = formData.description;
    this.unitOfMeasurement.systemLanguageId=formData.languageId;
    this.unitOfMeasurement.referenceId=this.refId;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
