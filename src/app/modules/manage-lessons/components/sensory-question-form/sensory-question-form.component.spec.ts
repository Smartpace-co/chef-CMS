import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensoryQuestionFormComponent } from './sensory-question-form.component';

describe('SensoryQuestionFormComponent', () => {
  let component: SensoryQuestionFormComponent;
  let fixture: ComponentFixture<SensoryQuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensoryQuestionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensoryQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
