import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHealthHygieneModalComponent } from './edit-health-hygiene-modal.component';

describe('EditHealthHygieneModalComponent', () => {
  let component: EditHealthHygieneModalComponent;
  let fixture: ComponentFixture<EditHealthHygieneModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditHealthHygieneModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHealthHygieneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
