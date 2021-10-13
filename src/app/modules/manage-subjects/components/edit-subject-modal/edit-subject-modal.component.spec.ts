import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubjectModalComponent } from './edit-subject-modal.component';

describe('EditSubjectModalComponent', () => {
  let component: EditSubjectModalComponent;
  let fixture: ComponentFixture<EditSubjectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSubjectModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
