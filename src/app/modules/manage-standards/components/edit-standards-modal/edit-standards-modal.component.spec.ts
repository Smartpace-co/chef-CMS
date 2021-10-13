import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStandardsModalComponent } from './edit-standards-modal.component';

describe('EditStandardsModalComponent', () => {
  let component: EditStandardsModalComponent;
  let fixture: ComponentFixture<EditStandardsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStandardsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStandardsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
