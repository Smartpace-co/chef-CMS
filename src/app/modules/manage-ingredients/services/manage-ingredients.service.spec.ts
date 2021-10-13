import { TestBed } from '@angular/core/testing';

import { ManageIngredientsService } from './manage-ingredients.service';

describe('ManageIngredientsService', () => {
  let service: ManageIngredientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageIngredientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
