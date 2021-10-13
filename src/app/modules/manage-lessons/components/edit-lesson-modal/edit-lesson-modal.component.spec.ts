import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLessonModalComponent } from './edit-lesson-modal.component';

describe('EditLessonModalComponent', () => {
  let component: EditLessonModalComponent;
  let fixture: ComponentFixture<EditLessonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLessonModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLessonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
