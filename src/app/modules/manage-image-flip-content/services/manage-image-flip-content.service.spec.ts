import { TestBed } from '@angular/core/testing';

import { ManageImageFlipContentService } from './manage-image-flip-content.service';
describe('ManageImageFlipContentService', () => {
  let service: ManageImageFlipContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageImageFlipContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
