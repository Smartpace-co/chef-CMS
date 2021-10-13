import { TestBed } from '@angular/core/testing';

import { ManageStandardsService } from './manage-standards.service';

describe('ManageStandardsService', () => {
  let service: ManageStandardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageStandardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
