import { TestBed } from '@angular/core/testing';

import { ManageCountriesService } from './manage-countries.service';

describe('ManageCountriesService', () => {
  let service: ManageCountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageCountriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
