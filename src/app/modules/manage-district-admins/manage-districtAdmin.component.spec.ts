import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDistrictAdminComponent } from './manage-districtAdmin.component';

describe('ManageDistrictAdminComponent', () => {
  let component: ManageDistrictAdminComponent;
  let fixture: ComponentFixture<ManageDistrictAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDistrictAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDistrictAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
