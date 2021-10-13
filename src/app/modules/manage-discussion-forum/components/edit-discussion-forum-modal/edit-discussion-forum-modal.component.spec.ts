import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDiscussionForumModalComponent } from './edit-discussion-forum-modal.component';

describe('EditDiscussionForumModalComponent', () => {
  let component: EditDiscussionForumModalComponent;
  let fixture: ComponentFixture<EditDiscussionForumModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDiscussionForumModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDiscussionForumModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
