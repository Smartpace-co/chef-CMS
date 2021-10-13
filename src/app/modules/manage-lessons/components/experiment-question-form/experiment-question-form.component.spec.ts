import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentQuestionFormComponent } from './experiment-question-form.component';

describe('ExperimentQuestionFormComponent', () => {
  let component: ExperimentQuestionFormComponent;
  let fixture: ComponentFixture<ExperimentQuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentQuestionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
