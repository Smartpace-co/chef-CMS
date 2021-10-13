import { TestBed } from '@angular/core/testing';

import { ManageSchoolService } from './manage-school.service';

describe('ManageDistrictAdminService', () => {
  let service: ManageSchoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageSchoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
