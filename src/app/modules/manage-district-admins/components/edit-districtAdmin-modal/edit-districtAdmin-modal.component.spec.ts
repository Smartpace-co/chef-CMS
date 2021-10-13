import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDistrictAdminModalComponent } from './edit-districtAdmin-modal.component';

describe('EditStandardsModalComponent', () => {
  let component: EditDistrictAdminModalComponent;
  let fixture: ComponentFixture<EditDistrictAdminModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDistrictAdminModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDistrictAdminModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
