import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityNameFormComponent } from './activity-name-form.component';

describe('ActivityNameFormComponent', () => {
  let component: ActivityNameFormComponent;
  let fixture: ComponentFixture<ActivityNameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityNameFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityNameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
