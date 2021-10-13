import { TestBed } from '@angular/core/testing';

import { ManageDiscussionForumService } from './manage-discussion-forum.service';

describe('ManageDiscussionForumService', () => {
  let service: ManageDiscussionForumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageDiscussionForumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
