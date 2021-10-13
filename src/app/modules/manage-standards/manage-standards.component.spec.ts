import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStandardsComponent } from './manage-standards.component';

describe('ManageStandardsComponent', () => {
  let component: ManageStandardsComponent;
  let fixture: ComponentFixture<ManageStandardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageStandardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStandardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
