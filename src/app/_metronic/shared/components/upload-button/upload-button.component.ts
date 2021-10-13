import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent implements OnInit {
  @Input() imageData;
  @Input() moreImage;
  @Input() multiple;
  @Output() onUpload = new EventEmitter();
  @Output() onRemove = new EventEmitter();
  @Input() isDisabled;
  constructor() { }

  ngOnInit(): void {
  }

  uploadImage(data) {
    this.onUpload.emit(data);
  }

  removeImage(img){
    this.onRemove.emit(img);
  }
}
