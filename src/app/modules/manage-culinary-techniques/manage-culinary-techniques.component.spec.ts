import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCulinaryTechniquesComponent } from './manage-culinary-techniques.component';

describe('ManageCulinaryTechniquesComponent', () => {
  let component: ManageCulinaryTechniquesComponent;
  let fixture: ComponentFixture<ManageCulinaryTechniquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCulinaryTechniquesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCulinaryTechniquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
