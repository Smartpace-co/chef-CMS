import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { ToolsService } from '../../services/tools.service';
import { Tools } from '../../_models/tools.model';

const EMPTY_TOOLS: Tools = {
  id: undefined,
  toolTitle: '',
  images: [],
  safetyLevelId: '',
  //difficultyLevelId: '',
  relatedQuestions: [],
  description: '',
  status: true
};
@Component({
  selector: 'app-edit-tools',
  templateUrl: './edit-tools.component.html',
  styleUrls: ['./edit-tools.component.scss']
})
export class EditToolsComponent implements OnInit {
  tools: any;
  @Input() id: number;
  @Input() refId: number;
  @Input() languageId: number;
  @Input() formGroupDef: FormGroup;
  isLoading$;
  formGroup: FormGroup;
  safetyLevelMaster: any = [];
  difficultyLevelMaster: any = []
  toolImages = [];
  moreToolImage: boolean = true;
  fileSize = 20971520;
  fileWidth = 200;
  fileHeight = 400;
  fileSizeError = false;
  fileResolutionError = false;
  private subscriptions: Subscription[] = [];
  languageMaster = [];

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private toolsService: ToolsService,
    public validationService: FormValidationServices,
    private toast:ToastrService
  ) {

  }


  ngOnInit(): void {
    this.isLoading$ = this.toolsService.isLoading$;
    if (this.refId) {
      this.toolsService.getLanguageListByFilter('tools', this.refId).subscribe((res) => {
        this.languageMaster = res.data;
      }, (e) => {
        console.log(e)
      })
    } else {
      this.loadLanguage()
    }
    this.loadMasters();
    this.loadUser();
  }

  // Load system languages
  loadLanguage() {
    this.toolsService.getLanguageList().subscribe((res) => {
      this.languageMaster = res.data;
    }, (e) => {
      console.log(e)
    })
  }

  loadMasters() {
    const sb = this.toolsService.loadMasters().pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_TOOLS);
      })
    ).subscribe((response: any) => {
      this.safetyLevelMaster = response?.[0].data;

    });
    this.subscriptions.push(sb);

  }

  loadUser() {
    if (!this.id) {
      //this.tools = EMPTY_TOOLS;
      this.tools = {
        id: undefined,
        toolTitle: '',
        images: [],
        safetyLevelId: '',
//        difficultyLevelId: '',
        relatedQuestions: [],
        description: '',
        status: true
      }
      this.loadForm();
    } else {
      const sb = this.toolsService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_TOOLS);
        })
      ).subscribe((tool: any) => {
        this.tools = tool.data;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      toolName: [this.tools.toolTitle, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      safetyLevel: [this.tools.safetyLevel?.id],
      images: [this.tools.images],
     // diffcultyLevel: [this.tools.difficultyLevel?.id],
      relatedQuestions: this.fb.array([]),
      description: [this.tools.description],
      status: [this.tools.status,Validators.compose([Validators.required])],
      languageId: [this.tools.systemLanguageId,Validators.compose([Validators.required])],

    });

    if (this.tools?.relatedQuestions.length > 0) {
      this.tools.relatedQuestions.forEach(e => {
        this.addQuantity(e);
      })
    } else {
      this.addQuantity(undefined)
    }
    if (this.tools.images.length > 0) {
      this.toolImages = [...this.tools.images];
      this.moreToolImage = false;
    }
  }


  save() {
    this.prepareTool();
    if (this.tools.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.toolsService.update(this.tools).pipe(
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
        return of(this.tools);
      }),
    ).subscribe(res => this.tools = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.toolsService.create(this.tools).pipe(
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
        return of(this.tools);
      }),
    ).subscribe((res: Tools) => this.tools = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareTool() {
    const formData = this.formGroup.value;
    this.tools.toolTitle = formData.toolName;
    this.tools.images = formData.images;
    this.tools.safetyLevelId = formData.safetyLevel;
  //  this.tools.difficultyLevelId = formData.diffcultyLevel;
    this.tools.status = formData.status;
    this.tools.description = formData.description;
    this.tools.relatedQuestions = formData.relatedQuestions
    this.tools.systemLanguageId = formData.languageId;
    this.tools.referenceId = this.refId;
  }


  // load link as a form array 
  relatedQuestion(): FormArray {
    return this.formGroup.get("relatedQuestions") as FormArray
  }

  // create a link function pushed the group in link form array
  addQuantity(data) {
    this.relatedQuestion().push(this.newLinkName(data));
  }

  // form froup of link array methods
  newLinkName(data): FormGroup {
    if (data == undefined) {
      return this.fb.group({
        question: [data, Validators.required],
      })
    }
    return this.fb.group({
      id: [data.id],
      question: [data.question, Validators.required],
    })
  }

  // remove link using a index
  removeQuantity(i: number) {
    this.relatedQuestion().removeAt(i);
  }

  uploadToolImage(event) {
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

          this.toolImages.push({ image: e.target.result });
          if (this.toolImages?.length == 1) {
            this.moreToolImage = false;

          }
          const sbCreate = this.toolsService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
            let tempArray = [];
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

  removeToolImage(data) {
    let tempArray = [];
    const index: number = this.toolImages.indexOf(data);
    if (index !== -1) {
      this.toolImages.splice(index, 1);
    }
    this.formGroup.patchValue({
      images: this.toolImages
    })
    if (this.toolImages?.length == 1) {
      this.moreToolImage = false;
    }
    else {
      this.moreToolImage = true
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }



}
