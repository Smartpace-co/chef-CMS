import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { delay, tap, catchError, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {


  @Input() service: any;
  @Input() id: number;
  @Input() fileName: string;
  @Input() action: string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(public modal: NgbActiveModal, public toast :ToastrService) { }

  ngOnInit(): void {
  }

  delete() {
    this.isLoading = true;
    const sb = this.service.delete(this.id).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap((res:any) => {
        if(res.status==200){
          this.toast.success(res.message,"Success");
        }
        else if(res.status==204){
          this.toast.info(res.message,"Success");
        }
        else{
          this.toast.error("Something went wrong","Error")
        }
        this.modal.close()
      }),
      catchError((err) => {
        this.toast.error("Something wrong","Error")
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  restoreLesson(){
    let data={
      id: this.id,
      isDeleted:false
    }
    this.isLoading = true;
    const sb = this.service.update(data).pipe(
      delay(1000), // 
      tap((res:any) => {
        if(res.status==200){
          this.toast.success("Lesson Restored successfully","Success");
        }
        else if(res.status==204){
          this.toast.info(res.message,"Success");
        }
        else{
          this.toast.error("Something went wrong","Error")
        }
        this.modal.close()
      }),
      catchError((err) => {
        this.toast.error("Something wrong","Error")
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }  

  deleteLesson(){
    let data={
      id: this.id,
      isDeleted:true
    }
    this.isLoading = true;
    const sb = this.service.update(data).pipe(
      delay(1000), // 
      tap((res:any) => {
        if(res.status==200){
          this.toast.success("Lesson deleted successfully","Success");
        }
        else if(res.status==204){
          this.toast.info(res.message,"Success");
        }
        else{
          this.toast.error("Something went wrong","Error")
        }
        this.modal.close()
      }),
      catchError((err) => {
        this.toast.error("Something wrong","Error")
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }  

  harddeleteLesson(){
   let data={
      id: this.id,
      isPermanentDeleted:true,
      isDeleted:true

    }
    this.isLoading = true;
    const sb = this.service.update(data).pipe(
      delay(1000), // 
      tap((res:any) => {
        if(res.status==200){
          this.toast.success("Lesson deleted successfully","Success");
        }
        else if(res.status==204){
          this.toast.info(res.message,"Success");
        }
        else{
          this.toast.error("Something went wrong","Error")
        }
        this.modal.close()
      }),
      catchError((err) => {
        this.toast.error("Something wrong","Error")
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb); 
  }  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
