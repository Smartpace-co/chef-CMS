import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteManyModalComponent } from './delete-many-modal.component';

describe('DeleteManyModalComponent', () => {
  let component: DeleteManyModalComponent;
  let fixture: ComponentFixture<DeleteManyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteManyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteManyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
