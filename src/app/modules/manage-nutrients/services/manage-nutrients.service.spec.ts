import { TestBed } from '@angular/core/testing';

import { ManageNutrientsService } from './manage-nutrients.service';

describe('ManageNutrientsService', () => {
  let service: ManageNutrientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageNutrientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
