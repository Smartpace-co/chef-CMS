import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCulinaryTechniquesModalComponent } from './edit-culinary-techniques-modal.component';

describe('EditCulinaryTechniquesModalComponent', () => {
  let component: EditCulinaryTechniquesModalComponent;
  let fixture: ComponentFixture<EditCulinaryTechniquesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCulinaryTechniquesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCulinaryTechniquesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
