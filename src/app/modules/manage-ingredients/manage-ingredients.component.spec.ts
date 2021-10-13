import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIngredientsComponent } from './manage-ingredients.component';

describe('ManageIngredientsComponent', () => {
  let component: ManageIngredientsComponent;
  let fixture: ComponentFixture<ManageIngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageIngredientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
