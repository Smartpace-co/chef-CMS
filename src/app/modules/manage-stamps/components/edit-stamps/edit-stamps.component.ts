import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageStampsService } from '../../services/manage-stamps.service';

import { Stamps } from '../../_model/stamp.model';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageCountriesService } from '../../../manage-countries/services/manage-countries.service';
import { ToastrService } from 'ngx-toastr';

const EMPTY_STAMP: Stamps = {
  id: undefined,
  stampTitle: '',
  stampType: null,
  countryId: '',
  levelTypeId: '',
  learningTypeId: '',
  items: [],
  images: [],
  status: true
}

@Component({
  selector: 'app-edit-stamps',
  templateUrl: './edit-stamps.component.html',
  styleUrls: ['./edit-stamps.component.scss']
})
export class EditStampsComponent implements OnInit {
  @Input() id: number;
  @Input() refId: number;
  @Input() languageId: number;

  imageUrl;
  isLoading$;
  private subscriptions: Subscription[] = [];
  stamp: any;
  languageMaster = [];

  formGroup: FormGroup;
  stampTypeMaster: any = [{ id: 1, type: 'Country' }, { id: 2, type: 'Level' }, { id: 3, type: 'Learning' }]
  levelTypeMaster: any = []
  learningTypeMaster: any = []
  countryMaster: any = []

  levelTypeDisabled: boolean;
  learningTypeDisabled: boolean;
  countryDisabled: boolean;

  stampImages = [];
  moreStampImage: boolean = true;
  itemImages = [];
  moreItemImage: boolean = true;
  fileSize = 20971520;
  fileWidth = 200;
  fileHeight = 400;
  fileSizeError = false;
  fileResolutionError = false;
  imagePreview: any;
  constructor(
    private stampService: ManageStampsService,
    public countriesService: ManageCountriesService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    private modalService: NgbModal,
    private toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.stampService.isLoading$;
    if (this.refId) {
      this.stampService.getLanguageListByFilter('stamps', this.refId).subscribe((res) => {
        this.languageMaster = res.data;
      }, (e) => {
        console.log(e)
      })
    } else {
      this.loadLanguage()
    }
    this.loadStamp();
    this.loadMasters();

  }

  // Load system languages
  loadLanguage() {
    this.stampService.getLanguageList().subscribe((res) => {
      this.languageMaster = res.data;
    }, (e) => {
      console.log(e)
    })
  }

  loadMasters() {
    const sb = this.stampService.loadMasters().pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_STAMP);
      })
    ).subscribe((response: any) => {
      this.countryMaster = response?.[0].data;
      this.levelTypeMaster = response?.[1].data;
      this.learningTypeMaster = response?.[2].data;
    });
    this.subscriptions.push(sb);

  }

  loadStamp() {
    if (!this.id) {
      this.stamp = {
        id: undefined,
        stampTitle: '',
        stampType: '',
        countryId: '',
        levelTypeId: '',
        learningTypeId: '',
        items: [],
        images: [],
        status: true
      }
      // this.stamp = EMPTY_STAMP;
      this.loadForm();
      this.formGroup.reset();

    } else {
      const sb = this.stampService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_STAMP);
        })
      ).subscribe((stamp: any) => {
        this.stamp = stamp.data;
/* 
        if (stamp.data.stampDetails == undefined) {
          this.stamp = stamp.data;
        } else {
          this.stamp = stamp.data.stampDetails;
          this.stamp.relatedItems = stamp.data.relatedItems;
        } */ 
        this.loadForm()
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      stampTitle: [this.stamp.stampTitle, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      stampType: [this.stamp.stampType, Validators.compose([Validators.required])],
      levelType: [this.stamp.levelTypeId, Validators.compose([Validators.nullValidator])],
      learningType: [this.stamp.learningTypeId, Validators.compose([Validators.nullValidator])],
      country: [this.stamp.countryId, Validators.compose([Validators.nullValidator])],
      images: [this.stamp.images, Validators.compose([Validators.required])],
      status: [this.stamp.status, Validators.required],
      relatedItems: this.fb.array([]),
      languageId: [this.stamp.systemLanguageId],

    });
    if (this.stamp.items.length > 0) {
      this.stamp.items.forEach(e => {
        this.addQuantity(e);
      })
    } else {
      this.addQuantity(undefined)
    }

      if (this.stamp?.images.length > 0) {
        this.stampImages = [...this.stamp.images];
        this.moreStampImage = false;
    }

    if (this.stamp.stampType == '') {
      this.levelTypeDisabled = true
      this.learningTypeDisabled = true
      this.countryDisabled = true
    }
    else if (this.stamp.stampType == 'Country') {
      this.levelTypeDisabled = true
      this.learningTypeDisabled = true
      this.countryDisabled = false
    }
    else if (this.stamp.stampType == 'Learning') {
      this.levelTypeDisabled = true
      this.learningTypeDisabled = false
      this.countryDisabled = true
    }
    else if (this.stamp.stampType == 'Level') {
      this.levelTypeDisabled = false
      this.learningTypeDisabled = true
      this.countryDisabled = true
    }


  }


  // load link as a form array 
  relatedItem(): FormArray {

    return this.formGroup.get("relatedItems") as FormArray
  }

  // create a link function pushed the group in link form array
  addQuantity(data) {
    this.relatedItem().push(this.newLinkName(data));
  }

  // form froup of link array methods
  newLinkName(data): FormGroup {
    if (data == undefined) {
      return this.fb.group({
        item: [''],
        itemStatus: [true],
        image:['']
      })

    }
    else {
      return this.fb.group({
        id: [data.id],
        item: [data.itemTitle],
        itemStatus: [data.status],
        image:[data.image]
      })
    }

  }

  // remove link using a index
  removeQuantity(i: number) {
    this.relatedItem().removeAt(i);
  }

  uploadImage(event,item) {
    console.log(item)
    if (event.target.files && event.target.files.length == 1) {
          const sbCreate= this.stampService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
            item.controls['image'].patchValue(res.data[0].mediaPath)
          });
          this.subscriptions.push(sbCreate);
        }
  }

  removeImage(item){
    item.controls['image'].patchValue('');
  }

  selectedStampType(val) {
    if (val == 'Learning') {
      this.levelTypeDisabled = true
      this.learningTypeDisabled = false
      this.countryDisabled = true

    }
    else if (val == 'Level') {
      this.levelTypeDisabled = false
      this.learningTypeDisabled = true
      this.countryDisabled = true
      
    }
    else {
      this.levelTypeDisabled = true
      this.learningTypeDisabled = true
      this.countryDisabled = false

    }

  }

  save() {
    this.prepareCustomer();
    if (this.stamp.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.stampService.update(this.stamp).pipe(
      tap((res: any) => {
        if (res.status == 200) {
          this.toast.success(res.message, "Success");
        }
        else if (res.status == 409) {
          this.toast.error(res.message, "Error");
        }
        else {
          this.toast.error("Something went wrong", "Error");
        }
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.stamp);
      }),
    ).subscribe(res => this.stamp = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.stampService.create(this.stamp).pipe(
      tap((res: any) => {
        if (res.status == 200) {
          this.toast.success(res.message, "Success");
        }
        else if (res.status == 409) {
          this.toast.error(res.message, "Error");
        }
        else {
          this.toast.error("Something went wrong", "Error");
        }
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.stamp);
      }),
    ).subscribe((res: Stamps) => this.stamp = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.stamp.stampTitle = formData.stampTitle;
    this.stamp.stampType = formData.stampType;
    this.stamp.levelTypeId = formData.levelType;
    this.stamp.learningTypeId = formData.learningType;
    this.stamp.countryId = formData.country;
    this.stamp.images = formData.images;
    this.stamp.status = formData.status;
    this.stamp.relatedItems = formData.relatedItems;
    this.stamp.systemLanguageId = formData.languageId;
    this.stamp.referenceId = this.refId;

  }

  uploadItemImage(event, index) {
    if (event.target.files && event.target.files.length <= 1) {
      let file = event.target.files;
      for (let i = 0; i < event.target.files.length; i++) {
        if (file[i].size > 20971520)   //max size limit is in bytes. (bytes / 1024).toFixed(2) + " KB";  (bytes / 1048576).toFixed(2) + " MB"
        {
          this.fileSizeError = true
        }

        let reader = new FileReader();
        reader.readAsDataURL(file[i]);
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
            const img_height = rs.currentTarget['height'];
            const img_width = rs.currentTarget['width'];
            if (img_height > this.fileHeight && img_width > this.fileWidth) {
              this.fileResolutionError = true;
            }
          }

          this.itemImages.push({ image: e.target.result });
          if (this.itemImages?.length == 1) {
            this.moreItemImage = false;

          }
          let tempArray = [];
          const sbCreate = this.stampService.imageUpload(event.target.files).pipe().subscribe((res: any) => {

            res.data.forEach(element => {
              tempArray.push(element.mediaPath)
            });
            this.formGroup.patchValue({
              itemImages: tempArray
            })
          });

          this.subscriptions.push(sbCreate);
        }
      }
    }
  }



  uploadStampImage(event) {
    let tempArray = [];
    if (event.target.files && event.target.files.length <= 1) {
      let file = event.target.files;

      for (let i = 0; i < event.target.files.length; i++) {
        if (file[i].size > 20971520)   //max size limit is in bytes. (bytes / 1024).toFixed(2) + " KB";  (bytes / 1048576).toFixed(2) + " MB"
        {
          this.fileSizeError = true
        }

        let reader = new FileReader();
        reader.readAsDataURL(file[i]);
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
            const img_height = rs.currentTarget['height'];
            const img_width = rs.currentTarget['width'];
            if (img_height > this.fileHeight && img_width > this.fileWidth) {
              this.fileResolutionError = true;
            }
          }
          this.stampImages.push({ image: e.target.result });
          if (this.stampImages?.length == 1) {
            this.moreStampImage = false;

          }
          const sbCreate = this.stampService.imageUpload(event.target.files).pipe().subscribe((res: any) => {

            res.data.forEach(element => {
              tempArray.push(element.mediaPath)
            });
            this.formGroup.patchValue({
              images: tempArray
            })
          });
          this.subscriptions.push(sbCreate);
        }
      }
    }

  }
  removeStampImage(data) {
    let tempArray = [];
    const index: number = this.stampImages.indexOf(data);
    if (index !== -1) {
      this.stampImages.splice(index, 1);
    }
    this.formGroup.patchValue({
      images: this.stampImages
    })
    if (this.stampImages?.length == 1) {
      this.moreStampImage = false;
    }
    else {
      this.moreStampImage = true
    }
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
