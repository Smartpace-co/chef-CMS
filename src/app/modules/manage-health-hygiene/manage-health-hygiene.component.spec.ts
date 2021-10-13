import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHealthHygieneComponent } from './manage-health-hygiene.component';

describe('ManageHealthHygieneComponent', () => {
  let component: ManageHealthHygieneComponent;
  let fixture: ComponentFixture<ManageHealthHygieneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageHealthHygieneComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageHealthHygieneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
