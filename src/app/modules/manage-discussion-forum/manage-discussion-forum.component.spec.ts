import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDiscussionForumComponent } from './manage-discussion-forum.component';

describe('ManageDiscussionForumComponent', () => {
  let component: ManageDiscussionForumComponent;
  let fixture: ComponentFixture<ManageDiscussionForumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDiscussionForumComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDiscussionForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
