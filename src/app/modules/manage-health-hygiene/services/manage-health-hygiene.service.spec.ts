import { TestBed } from '@angular/core/testing';

import { ManageHealthHygieneService } from './manage-health-hygiene.service';

describe('ManageHealthHygieneService', () => {
  let service: ManageHealthHygieneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageHealthHygieneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
