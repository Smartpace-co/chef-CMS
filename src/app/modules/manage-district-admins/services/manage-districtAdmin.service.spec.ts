import { TestBed } from '@angular/core/testing';

import { ManageDistrictAdminService } from './manage-districtAdmin.service';

describe('ManageDistrictAdminService', () => {
  let service: ManageDistrictAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageDistrictAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
