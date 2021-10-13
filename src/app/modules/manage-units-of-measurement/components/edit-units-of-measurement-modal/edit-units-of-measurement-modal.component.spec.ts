import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUnitsOfMeasurementModalComponent } from './edit-units-of-measurement-modal.component';

describe('EditUnitsOfMeasurementModalComponent', () => {
  let component: EditUnitsOfMeasurementModalComponent;
  let fixture: ComponentFixture<EditUnitsOfMeasurementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUnitsOfMeasurementModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUnitsOfMeasurementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
