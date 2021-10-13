import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageImageFlipContentService } from '../../services/manage-image-flip-content.service';

import { ImageFlipContent } from '../../_model/image-flip-content.model';

const EMPTY_IMAGE_DRAG_DROP: ImageFlipContent = {
  id: undefined,
  title: '',
  images:[],
  categoryId:null,
  status: true
}
@Component({
  selector: 'app-edit-image-flip-content-modal',
  templateUrl: './edit-image-flip-content-modal.component.html',
  styleUrls: ['./edit-image-flip-content-modal.component.scss']
})
export class EditImageFlipContentModalComponent implements OnInit {
  @Input() id: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  imageFlipContent: ImageFlipContent;
  formGroup: FormGroup;
  flipImages = [];
  moreFlipImage: boolean = true;
  fileSize = 20971520;
  fileWidth = 200;
  fileHeight = 400;
  fileSizeError = false;
  fileResolutionError = false;
  themeMaster=[];
  constructor(
    private imageFlipContentService: ManageImageFlipContentService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    private toast : ToastrService

  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.imageFlipContentService.isLoading$;
    this.imageFlipContentService.getCategories().subscribe((res)=>{
      this.themeMaster=res.data;
    },(err)=>{
      console.log(err)
    });
    this.loadImageFlipContent();
  }

  loadImageFlipContent() {
    if (!this.id) {
      this.imageFlipContent = EMPTY_IMAGE_DRAG_DROP;
      this.loadNewForm();

    } else {
      const sb = this.imageFlipContentService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_IMAGE_DRAG_DROP);
        })
      ).subscribe((imageFlipContent: any) => {
        this.imageFlipContent = imageFlipContent.data;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      title: [this.imageFlipContent.title, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      status: [this.imageFlipContent.status, Validators.compose([Validators.required])],
      gameImage:[this.imageFlipContent.images],
      themeType:[this.imageFlipContent.categoryId]

    });

    if(this.imageFlipContent.images && this.imageFlipContent.images.length>0){
      this.flipImages=[...this.imageFlipContent.images];
      this.moreFlipImage = false;
      }
  }

  loadNewForm() {

    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      status: [true, Validators.compose([Validators.required])],
      gameImage:[''],
      themeType:[null]
    });

  }

  save() {
    this.prepareCustomer();
    if (this.imageFlipContent.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.imageFlipContentService.update(this.imageFlipContent).pipe(
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
        return of(this.imageFlipContent);
      }),
    ).subscribe(res => this.imageFlipContent = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.imageFlipContentService.create(this.imageFlipContent).pipe(
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
        return of(this.imageFlipContent);
      }),
    ).subscribe((res: ImageFlipContent) => this.imageFlipContent = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    if(formData.gameImage)
    {
      this.imageFlipContent.images=formData.gameImage;

    }

    this.imageFlipContent.status = formData.status;
    this.imageFlipContent.title = formData.title;
    this.imageFlipContent.categoryId=formData.themeType;
  }

  uploadFlipImage(event) {
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

          this.flipImages.push({image:e.target.result});
          if (this.flipImages?.length == 1) {
            this.moreFlipImage = false;

          }
          const sbCreate= this.imageFlipContentService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
            let tempArray=[];
            res.data.forEach(element => {
              tempArray.push(element.mediaPath)
            });
            this.formGroup.patchValue({
              gameImage: tempArray
            })
          });
          this.subscriptions.push(sbCreate);
        }
      }
    }

  }

  removeFlipImage(data){
    let tempArray=[];
    const index: number = this.flipImages.indexOf(data);
    if (index !== -1) {
    this.flipImages.splice(index,1);
    }
    this.formGroup.patchValue({
      gameImage: this.flipImages
    })
    if (this.flipImages?.length == 1) {
      this.moreFlipImage = false;
    }
      else{
        this.moreFlipImage = true
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
