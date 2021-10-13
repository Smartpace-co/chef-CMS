import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIngredientsModalComponent } from './edit-ingredients-modal.component';

describe('EditIngredientsModalComponent', () => {
  let component: EditIngredientsModalComponent;
  let fixture: ComponentFixture<EditIngredientsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIngredientsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIngredientsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
