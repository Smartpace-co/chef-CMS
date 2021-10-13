import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNutrientsComponent } from './manage-nutrients.component';

describe('ManageNutrientsComponent', () => {
  let component: ManageNutrientsComponent;
  let fixture: ComponentFixture<ManageNutrientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageNutrientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageNutrientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
