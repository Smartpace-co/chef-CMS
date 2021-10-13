import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStampsComponent } from './manage-stamps.component';

describe('ManageStampsComponent', () => {
  let component: ManageStampsComponent;
  let fixture: ComponentFixture<ManageStampsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageStampsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStampsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
