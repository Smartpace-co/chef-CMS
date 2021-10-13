import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIssuesFeedbackComponent } from './manage-issuesFeedback.component';

describe('ManageIssuesFeedbackComponent', () => {
  let component: ManageIssuesFeedbackComponent;
  let fixture: ComponentFixture<ManageIssuesFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageIssuesFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageIssuesFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
