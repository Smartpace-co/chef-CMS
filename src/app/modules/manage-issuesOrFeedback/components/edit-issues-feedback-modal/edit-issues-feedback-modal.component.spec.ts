import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIssuesFeedbackModalComponent } from './edit-issues-feedback-modal.component';

describe('EditStandardsModalComponent', () => {
  let component: EditIssuesFeedbackModalComponent;
  let fixture: ComponentFixture<EditIssuesFeedbackModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIssuesFeedbackModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIssuesFeedbackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
