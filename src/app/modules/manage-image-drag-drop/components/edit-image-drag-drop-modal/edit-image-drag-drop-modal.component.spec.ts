import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImageDragDropModalComponent } from './edit-image-drag-drop-modal.component';

describe('EditImageDragDropModalComponent', () => {
  let component: EditImageDragDropModalComponent;
  let fixture: ComponentFixture<EditImageDragDropModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditImageDragDropModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditImageDragDropModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
