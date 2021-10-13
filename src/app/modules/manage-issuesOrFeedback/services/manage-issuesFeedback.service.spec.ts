import { TestBed } from '@angular/core/testing';

import { ManageIssuesFeedback } from './manage-issuesFeedback.service';

describe('ManageCountriesService', () => {
  let service: ManageIssuesFeedback;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageIssuesFeedback);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
