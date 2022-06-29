import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { SubjectServices } from 'src/app/modules/manage-subjects/services/manage-subjects.service';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ManageStandardsService } from '../../services/manage-standards.service';

import { Standards } from '../../_model/standard.model';

const EMPTY_STANDARD = {
  id: undefined,
  standardTitle: '',
  subjectId: null,
  gradeId:null,
  image: '',
  status: true
}
@Component({
  selector: 'app-edit-standards-modal',
  templateUrl: './edit-standards-modal.component.html',
  styleUrls: ['./edit-standards-modal.component.scss']
})
export class EditStandardsModalComponent implements OnInit {
  @Input() id: number;
  @Input() refId: number;
  @Input() languageId: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  standard: any;
  formGroup: FormGroup;
  subjectMaster: any = [];
  languageMaster=[];
  skillMaster=[];
  gradeMaster=[];
  fileSizeError: boolean=false;
  fileResolutionError: boolean=false;
  moreStandardImage: boolean=true;
  standardImages: any=[];
  fileSize = 20971520;
  fileWidth = 200;
  fileHeight = 400;
  constructor(
    private standardService: ManageStandardsService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    public subjectService: SubjectServices,
    private toast:ToastrService

  ) {
    this.subjectService.fetch();
    this.standardService.getSubjects().subscribe(res => {
      this.subjectMaster = res.data.filter(s => s.status === true)
    })
  }

  ngOnInit(): void {
    this.isLoading$ = this.standardService.isLoading$;
    this.loadMasters();
    if(this.refId){
      this.subjectService.getLanguageListByFilter('standards',this.refId).subscribe((res)=>{
        this.languageMaster=res.data;
      },(e)=>{
        console.log(e)
      })
    }else{
      this.loadLanguage()
    }
    this.loadStandard();
  }

  loadMasters() {
    const sb = this.standardService.loadMasters().pipe(
      first(),
      catchError((errorMessage) => {
        console.log(errorMessage)
        return of();
      })
    ).subscribe((response: any) => {
      this.gradeMaster=response?.[0].data;
    });
    this.subscriptions.push(sb);

  }

  // Load system languages
  loadLanguage(){
    this.subjectService.getLanguageList().subscribe((res)=>{
      this.languageMaster=res.data;
    },(e)=>{
      console.log(e)
    })
  }

  loadStandard() {
    if (!this.id) {
      this.standard = {
        id: undefined,
        standardTitle: '',
        subjectId: null,
        gradeId:null,
        image: '',
        status: true
      };
      this.loadForm();
    } else {
      const sb = this.standardService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_STANDARD);
        })
      ).subscribe((standard: any) => {
        this.standard = standard.data;
        this.standard.skills=this.standard.skills.map(dt => dt.skill);

        this.loadForm();
        this.changeSubject(this.standard.subject?.id);
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      standardTitle: [this.standard.standardTitle, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      status: [this.standard.status, Validators.compose([Validators.required])],
      grade: [this.standard.grade?.id, Validators.compose([Validators.required])],
      subject: [this.standard.subject?.id, Validators.compose([Validators.required])],
      image: [this.standard.image],
      languageId:[this.standard.systemLanguageId],
      skill:[this.standard.skills],

    });
    if(this.standard?.image){
      this.moreStandardImage=false;
      this.standardImages.push({image:this.standard?.image})
    }

  }

  changeSubject(subjectId){
    this.standardService.getSkills(subjectId).subscribe((res)=>{
      this.skillMaster = res.data;
    },(err)=>{
      console.log(err)
    })
  }

  save() {
    this.prepareCustomer();
    if (this.standard.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.standardService.update(this.standard).pipe(
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
        return of(this.standard);
      }),
    ).subscribe(res => this.standard = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.standardService.create(this.standard).pipe(
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
        return of(this.standard);
      }),
    ).subscribe((res: Standards) => this.standard = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.standard.standardTitle = formData.standardTitle;
    this.standard.status = formData.status;
    this.standard.gradeId = formData.grade;
    this.standard.subjectId = formData.subject;
    this.standard.image = formData.image;
    this.standard.systemLanguageId=formData.languageId;
    this.standard.referenceId=this.refId;
    if(formData.skill){
      this.standard.skills=formData.skill.map(res=>res.id)
    }
  }

  uploadStandardImage(event) {
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

          this.standardImages.push({ image: e.target.result });
          if (this.standardImages?.length == 1) {
            this.moreStandardImage = false;

          }
          const sbCreate = this.standardService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
            let tempArray = [];
            res.data.forEach(element => {
              tempArray.push(element.mediaPath)
            });
            this.formGroup.patchValue({
              image: tempArray[0]
            })
          });
          this.subscriptions.push(sbCreate);
        }
      }
    }

  }

  removeStandardImage(data) {
    let tempArray = [];
    const index: number = this.standardImages.indexOf(data);
    if (index !== -1) {
      this.standardImages.splice(index, 1);
    }
    this.formGroup.patchValue({
      image: ''
    })
    if (this.standardImages?.length == 1) {
      this.moreStandardImage = false;
    }
    else {
      this.moreStandardImage = true
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
