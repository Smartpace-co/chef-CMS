import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConversationSentenceModalComponent } from './edit-conversationSentence-modal.component';

describe('EditStandardsModalComponent', () => {
  let component: EditConversationSentenceModalComponent;
  let fixture: ComponentFixture<EditConversationSentenceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConversationSentenceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConversationSentenceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
