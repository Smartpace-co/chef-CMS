import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRoleStatusModalComponent } from './update-role-status-modal.component';

describe('UpdateRoleStatusModalComponent', () => {
  let component: UpdateRoleStatusModalComponent;
  let fixture: ComponentFixture<UpdateRoleStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRoleStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRoleStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
