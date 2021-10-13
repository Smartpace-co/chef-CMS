import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStampsComponent } from './edit-stamps.component';

describe('EditStampsComponent', () => {
  let component: EditStampsComponent;
  let fixture: ComponentFixture<EditStampsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStampsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStampsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
