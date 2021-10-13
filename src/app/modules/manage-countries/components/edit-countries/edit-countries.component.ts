import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { Roles } from 'src/app/modules/manage-role/_models/role.model';
import { FormValidationServices } from 'src/app/_metronic/shared/form-validation.service';
import { Country } from '../../-models/country.model';
import { ManageCountriesService } from '../../services/manage-countries.service';

const EMPTY_COUNTRY: Country = {
  id: undefined,
  countryTrack:'',
  countryName: '',
  grades: '',
  languages: '',
  images:[],
  backgroundImage:'',
  status: true,
  systemLanguageId:null
};
@Component({
  selector: 'app-edit-countries',
  templateUrl: './edit-countries.component.html',
  styleUrls: ['./edit-countries.component.scss']
})
export class EditCountriesComponent implements OnInit {

  @Input() id: number;
  @Input() refId: number;
  @Input() languageId: number;

  isLoading$;
  countries: any;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  gradesMaster: any = [];
  languagesMaster: any = [];
  groupList:any = [];
  languageList:any = [];
  flagImages = [];
  moreFlagImage: boolean = true;
  backgroundImages = [];
  moreBackgroundImage: boolean = true;
  fileSize = 20971520;
  fileWidth = 140;
  fileHeight = 95;
  fileSizeError = false;
  fileResolutionError = false;
  bgfileResolutionError = false;
  languageMaster: any = []
  systemLanguageMaster:any=[]
  gradeMaster: any = []

  constructor(
    private countriesService: ManageCountriesService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public validationService: FormValidationServices,
    private toast:ToastrService,
  ) {
    // $(document).ready(function () {
    //   $('.js-example-basic-multiple').select2();
    // });
  }

  ngOnInit(): void {
    this.isLoading$ = this.countriesService.isLoading$;
    if(this.refId){
      this.countriesService.getLanguageListByFilter('countries',this.refId).subscribe((res)=>{
        this.systemLanguageMaster=res.data;
      },(e)=>{
        console.log(e)
      })
    }else{
      this.loadLanguage()
    }
    this.loadMasters();
    this.loadCustomer();
  }

  // Load system languages
  loadLanguage(){
    this.countriesService.getLanguageList().subscribe((res)=>{
      this.systemLanguageMaster=res.data;
    },(e)=>{
      console.log(e)
    })
  }

  loadMasters(){
    const sb = this.countriesService.loadMasters().pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_COUNTRY);
      })
    ).subscribe((response: any) => {
      this.languageMaster=response?.[0].data;
      this.gradeMaster=response?.[1].data;
    });
    this.subscriptions.push(sb);

  }
  loadCustomer() {

    if (!this.id) {
      this.countries={
        id: undefined,
        countryName: '',
        grades: [],
        languages: '',
        images:[],
        backgroundImage:'',
        status: true,
        systemLanguageId:null}
     // this.countries = EMPTY_COUNTRY;
      this.loadNewForm();

    } else {
      const sb = this.countriesService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_COUNTRY);
        })
      ).subscribe((countrie: any) => {
        console.log(countrie)
        this.countries= countrie.data;
        console.log(this.countries)

        if (countrie.data.country_grades.length>0){
     countrie.data.country_grades.forEach((item, index) => {
      this.groupList.push(item.grade);

    });
    }
        if (countrie.data.country_languages.length>0){
    countrie.data.country_languages.forEach((item, index) => {
      this.languageList.push(item.language);

    });
    }
           this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      countryName: [this.countries.countryName, Validators.compose([Validators.required])],
      grades: [this.countries.grades, Validators.compose([Validators.required])],
      languages: [this.countries.languages, Validators.compose([Validators.required])],
      countryTrack:[this.countries.countryTrack, Validators.compose([Validators.required])],
      flagImage:[this.countries.images, Validators.compose([Validators.required])],
      backgroundImage:[this.countries.backgroundImage, Validators.compose([Validators.required])],
      status: [this.countries.status, Validators.required],
      languageId:[this.countries.systemLanguageId],

    });
    if(this.countries.images.length>0){
      this.flagImages=[...this.countries.images];
      this.moreFlagImage = false;
    }
    if(this.countries.backgroundImage){
      this.backgroundImages=[{image:this.countries.backgroundImage}];
      this.moreBackgroundImage=false;
    }

  }

  loadNewForm() {
    this.validationService.formGroupDef = this.formGroup = this.fb.group({
      countryName: ['', Validators.compose([Validators.required])],
      grades: [this.countries.grades, Validators.compose([Validators.required])],
      countryTrack:['', Validators.compose([Validators.required])],
      languages: [this.countries.languages, Validators.compose([Validators.required])],
      flagImage:['', Validators.compose([Validators.required])],
      backgroundImage:['', Validators.compose([Validators.required])],
      status: [true, Validators.required],
      languageId:[this.countries.systemLanguageId],
    });


  }


  save() {
    this.prepareCustomer();
    if (this.countries.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.countriesService.update(this.countries).pipe(
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
        return of(this.countries);
      }),
    ).subscribe(res => this.countries = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.countriesService.create(this.countries).pipe(
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
        return of(this.countries);
      }),
    ).subscribe((res: Country) => this.countries = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.countries.images=formData.flagImage;
    this.countries.backgroundImage=formData.backgroundImage;
    this.countries.languages = formData.languages;
    this.countries.countryTrack=formData.countryTrack
    this.countries.status = formData.status;
    this.countries.grades = formData.grades;
    this.countries.countryName = formData.countryName;
    this.countries.systemLanguageId=formData.languageId;
    this.countries.referenceId=this.refId;

  }

  uploadFlagImage(event) {
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
            if (img_height != this.fileHeight && img_width != this.fileWidth) {
              this.fileResolutionError = true;
            }
            else{
              this.fileResolutionError=false;
            }

            if(!this.fileResolutionError){
              this.flagImages.push({image:e.target.result});

              if (this.flagImages?.length == 1) {
                this.moreFlagImage = false;

              }
              const sbCreate= this.countriesService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
                let tempArray=[];
                res.data.forEach(element => {
                  tempArray.push(element.mediaPath)
                });
                this.formGroup.patchValue({
                  flagImage: tempArray
                })
              });
              this.subscriptions.push(sbCreate);
            }
          }
        }
      }
    }

  }

  uploadBackgroundImage(event) {
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
            if (img_height != 1136 && img_width != 1848) {
              this.bgfileResolutionError = true;
            }
            else{
              this.bgfileResolutionError=false;
            }

            if(!this.bgfileResolutionError){
              this.backgroundImages.push({image:e.target.result});

              if (this.backgroundImages?.length == 1) {
                this.moreBackgroundImage = false;

              }
              const sbCreate= this.countriesService.imageUpload(event.target.files).pipe().subscribe((res: any) => {
                let tempArray=[];
                res.data.forEach(element => {
                  tempArray.push(element.mediaPath)
                });
                this.formGroup.patchValue({
                  backgroundImage: tempArray[0]
                })
              });
              this.subscriptions.push(sbCreate);
            }
          }
        }
      }
    }

  }

  removeBackgroundImage(data){
    const index: number = this.backgroundImages.indexOf(data);
    if (index !== -1) {
    this.backgroundImages.splice(index,1);
    }
    this.formGroup.patchValue({
     backgroundImage: this.backgroundImages
    })
    if (this.backgroundImages?.length == 1) {
      this.moreBackgroundImage = false;
    }
      else{
        this.moreBackgroundImage = true
    }
  }

  removeFlagImage(data){
    const index: number = this.flagImages.indexOf(data);
    if (index !== -1) {
    this.flagImages.splice(index,1);
    }
    this.formGroup.patchValue({
     flagImage: this.flagImages
    })
    if (this.flagImages?.length == 1) {
      this.moreFlagImage = false;
    }
      else{
        this.moreFlagImage = true
    }
  }

  uploadCountryTrack(event){
    if (event.target.files && event.target.files.length == 1) {
      const sbCreate= this.countriesService.audioUpload(event.target.files).pipe().subscribe((res: any) => {
        this.formGroup.controls['countryTrack'].patchValue(res.data[0].mediaPath)
      });
      this.subscriptions.push(sbCreate);
    }
  }

  removeTrack(){
    this.formGroup.controls['countryTrack'].patchValue('');

  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
