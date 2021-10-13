import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonDashboardComponent } from './lesson-dashboard.component';

describe('LessonDashboardComponent', () => {
  let component: LessonDashboardComponent;
  let fixture: ComponentFixture<LessonDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
