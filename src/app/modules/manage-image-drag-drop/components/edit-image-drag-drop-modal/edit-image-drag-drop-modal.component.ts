import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageImageDragDropService } from '../../services/manage-image-drag-drop.service';
import { ImageDragDrops } from '../../_model/image-drag-drop.model';

const EMPTY_IMAGE_DRAG_DROP: ImageDragDrops = {
  id: undefined,
  title: '',
  images:[],
  categoryId:null,
  status: true
}
@Component({
  selector: 'app-edit-image-drag-drop-modal',
  templateUrl: './edit-image-drag-drop-modal.component.html',
  styleUrls: ['./edit-image-drag-drop-modal.component.scss']
})
export class EditImageDragDropModalComponent implements OnInit {
  @Input() id: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  imageDragDrop: ImageDragDrops;
  formGroup: FormGroup;
  gameImages = [];
  moreGameImage: boolean = true;
  fileSize = 20971520;
  fileWidth = 200;
  fileHeight = 400;
  fileSizeError = false;
  fileResolutionError = false;
  questionCategoryMaster=[];
  constructor(
    private imageDragDropService: ManageImageDragDropService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    private toast :ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.imageDragDropService.isLoading$;
    this.imageDragDropService.getCategories().subscribe((res)=>{
      this.questionCategoryMaster=res.data;
    },(err)=>{
      console.log(err)
    });
    this.loadImageDragDrop();
  }

  loadImageDragDrop() {
    if (!this.id) {
      this.imageDragDrop = EMPTY_IMAGE_DRAG_DROP;
      this.loadNewForm();

    } else {
      const sb = this.imageDragDropService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_IMAGE_DRAG_DROP);
        })
      ).subscribe((imageDragDrop: any) => {
        this.imageDragDrop = imageDragDrop.data;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      title: [this.imageDragDrop.title, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      status: [this.imageDragDrop.status, Validators.compose([Validators.required])],
      gameImage:[this.imageDragDrop.images],
      questionCategory:[this.imageDragDrop.categoryId]

    });

    if(this.imageDragDrop.images && this.imageDragDrop.images.length>0){
      this.gameImages=[...this.imageDragDrop.images];
      this.moreGameImage = false;
      }
  }

  loadNewForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      status: [true, Validators.compose([Validators.required])],
      gameImage:[''],
      questionCategory:[null]

    });

  }


  save() {
    this.prepareCustomer();
    if (this.imageDragDrop.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.imageDragDropService.update(this.imageDragDrop).pipe(
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
        return of(this.imageDragDrop);
      }),
    ).subscribe(res => this.imageDragDrop = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.imageDragDropService.create(this.imageDragDrop).pipe(
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
        return of(this.imageDragDrop);
      }),
    ).subscribe((res: ImageDragDrops) => this.imageDragDrop = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {

    const formData = this.formGroup.value;
    if(formData.gameImage)
    {
          this.imageDragDrop.images=formData.gameImage;

    }
    this.imageDragDrop.status = formData.status;
    this.imageDragDrop.title = formData.title;
    this.imageDragDrop.categoryId=formData.questionCategory;
}

  uploadGameImage(event) {
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

          this.gameImages.push({image:e.target.result});
          if (this.gameImages?.length == 1) {
            this.moreGameImage = false;

          }
          const sbCreate= this.imageDragDropService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
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

  removeGameImage(data){
    let tempArray=[];
    const index: number = this.gameImages.indexOf(data);
    if (index !== -1) {
    this.gameImages.splice(index,1);
    }
    this.formGroup.patchValue({
     gameImage: this.gameImages
    })
    if (this.gameImages?.length == 1) {
      this.moreGameImage = false;
    }
      else{
        this.moreGameImage = true
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
