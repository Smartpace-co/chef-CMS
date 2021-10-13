import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentStepsFormComponent } from './experiment-steps-form.component';

describe('ExperimentStepsFormComponent', () => {
  let component: ExperimentStepsFormComponent;
  let fixture: ComponentFixture<ExperimentStepsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentStepsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentStepsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
