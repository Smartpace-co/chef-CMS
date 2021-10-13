import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubscriptionPkgComponent } from './update-subscription-pkg.component';

describe('UpdateRoleComponent', () => {
  let component: UpdateSubscriptionPkgComponent;
  let fixture: ComponentFixture<UpdateSubscriptionPkgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSubscriptionPkgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSubscriptionPkgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
