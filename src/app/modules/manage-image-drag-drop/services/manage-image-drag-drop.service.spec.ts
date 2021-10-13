import { TestBed } from '@angular/core/testing';

import { ManageImageDragDropService } from './manage-image-drag-drop.service';
describe('ManageImageDragDropService', () => {
  let service: ManageImageDragDropService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageImageDragDropService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
