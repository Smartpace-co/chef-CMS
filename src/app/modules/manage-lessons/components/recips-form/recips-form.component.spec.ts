import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipsFormComponent } from './recips-form.component';

describe('RecipsFormComponent', () => {
  let component: RecipsFormComponent;
  let fixture: ComponentFixture<RecipsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
