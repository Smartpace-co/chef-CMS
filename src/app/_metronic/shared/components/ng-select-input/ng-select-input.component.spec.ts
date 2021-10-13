import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSelectInputComponent } from './ng-select-input.component';

describe('NgSelectInputComponent', () => {
  let component: NgSelectInputComponent;
  let fixture: ComponentFixture<NgSelectInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgSelectInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
