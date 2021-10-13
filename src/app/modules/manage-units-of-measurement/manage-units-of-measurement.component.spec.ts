import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUnitsOfMeasurementComponent } from './manage-units-of-measurement.component';

describe('ManageUnitsOfMeasurementComponent', () => {
  let component: ManageUnitsOfMeasurementComponent;
  let fixture: ComponentFixture<ManageUnitsOfMeasurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUnitsOfMeasurementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUnitsOfMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
