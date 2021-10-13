import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageImageFlipContentComponent } from './manage-image-flip-content.component';

describe('ManageImageFlipContentComponent', () => {
  let component: ManageImageFlipContentComponent;
  let fixture: ComponentFixture<ManageImageFlipContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageImageFlipContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageImageFlipContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
