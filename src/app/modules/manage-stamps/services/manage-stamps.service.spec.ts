import { TestBed } from '@angular/core/testing';

import { ManageStampsService } from './manage-stamps.service';

describe('ManageStampsService', () => {
  let service: ManageStampsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageStampsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
