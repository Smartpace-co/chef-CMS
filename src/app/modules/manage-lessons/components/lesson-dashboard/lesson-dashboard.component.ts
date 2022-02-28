import { Component, OnInit } from '@angular/core';
import { ManageLessonsService } from '../../services/manage-lessons.service';
import { saveAs } from 'file-saver';
import {ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lesson-dashboard',
  templateUrl: './lesson-dashboard.component.html',
  styleUrls: ['./lesson-dashboard.component.scss']
})
export class LessonDashboardComponent implements OnInit {
  fileInputLabel: any;
  gradeMaster=[];
  constructor(public lessonService:ManageLessonsService,private toast : ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.lessonService.getLessonCount();
  }

  /**
   * Go to lesson list page
   */
  filterByGrade(grade){
    this.router.navigateByUrl('manage-lessons/lessons/' + grade.id);
    
  }

  /**
   * To download sample .xlsx, .xls, .csv file
   */
   uploadFile(event){
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.lessonService.uploadFile(file).subscribe((dt:any)=>{
        this.fileInputLabel = dt.data[0].mediaName;
        this.insertBulkLesson();
      },(err)=>{
        console.log(err)
      })
      }
    
  }

  /**
   * To download sample .xlsx, .xls, .csv file
   */
   onDownloadFile(): void {
   /*  this.lessonService.downloadFile().subscribe((response:any)=>{
      if (response) { */
        saveAs(environment.bucketUrl+'/lessons.xlsx', `lessons.xlsx`);
        this.toast.success("File downloaded successfully","Success")
     /*  }
    },(err)=>{
      this.toast.error("Download Failed","Error")
    }) */
       //  saveAs('https://www.cmu.edu/blackboard/files/evaluate/tests-example.xls', `test.xlsx`);
        //  this.toast.showToast('File downloaded Successfully', '', 'success');
  }

  insertBulkLesson(){
    let data={
      fileName:this.fileInputLabel
    }
    this.lessonService.insertBulkRecord(data).subscribe((res)=>{
      if(res.data.success >0){
        this.toast.success("Added "+ res.data.success+ " lessons successfully","Success")
        this.lessonService.fetch();

      }
    },(err)=>{
      this.toast.success("Failed to add lessons","Error")

    })
  }

}
