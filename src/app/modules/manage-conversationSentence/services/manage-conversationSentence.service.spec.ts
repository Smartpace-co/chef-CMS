import { TestBed } from '@angular/core/testing';

import { ManageConversationSentenceService } from './manage-conversationSentence.service';

describe('ManageConversationSentenceService', () => {
  let service: ManageConversationSentenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageConversationSentenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
