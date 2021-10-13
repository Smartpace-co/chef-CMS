import { TestBed } from '@angular/core/testing';

import { ManageSubjectsService } from './manage-subjects.service';

describe('ManageSubjectsService', () => {
  let service: ManageSubjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageSubjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
