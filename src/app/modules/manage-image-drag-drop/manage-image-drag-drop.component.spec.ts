import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageConversationSentenceComponent } from './manage-conversationSentence.component';

describe('ManageConversationSentenceComponent', () => {
  let component: ManageConversationSentenceComponent;
  let fixture: ComponentFixture<ManageConversationSentenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageConversationSentenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageConversationSentenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
