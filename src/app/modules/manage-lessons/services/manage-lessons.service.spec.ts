import { TestBed } from '@angular/core/testing';

import { ManageLessonsService } from './manage-lessons.service';

describe('ManageLessonsService', () => {
  let service: ManageLessonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageLessonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
