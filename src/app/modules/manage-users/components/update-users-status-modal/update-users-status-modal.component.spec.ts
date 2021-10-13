import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUsersStatusModalComponent } from './update-users-status-modal.component';

describe('UpdateUsersStatusModalComponent', () => {
  let component: UpdateUsersStatusModalComponent;
  let fixture: ComponentFixture<UpdateUsersStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUsersStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUsersStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
