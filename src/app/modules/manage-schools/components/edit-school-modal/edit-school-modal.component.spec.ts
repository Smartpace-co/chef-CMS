import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSchoolModalComponent } from './edit-school-modal.component';

describe('EditSchoolModalComponent', () => {
  let component: EditSchoolModalComponent;
  let fixture: ComponentFixture<EditSchoolModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSchoolModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSchoolModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
