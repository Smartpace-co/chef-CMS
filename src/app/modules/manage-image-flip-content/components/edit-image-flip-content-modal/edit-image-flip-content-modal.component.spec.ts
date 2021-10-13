import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImageFlipContentModalComponent } from './edit-image-flip-content-modal.component';

describe('EditImageDragDropModalComponent', () => {
  let component: EditImageFlipContentModalComponent;
  let fixture: ComponentFixture<EditImageFlipContentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditImageFlipContentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditImageFlipContentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
