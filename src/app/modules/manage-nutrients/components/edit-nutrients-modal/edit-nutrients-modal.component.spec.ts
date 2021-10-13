import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNutrientsModalComponent } from './edit-nutrients-modal.component';

describe('EditNutrientsModalComponent', () => {
  let component: EditNutrientsModalComponent;
  let fixture: ComponentFixture<EditNutrientsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNutrientsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNutrientsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
