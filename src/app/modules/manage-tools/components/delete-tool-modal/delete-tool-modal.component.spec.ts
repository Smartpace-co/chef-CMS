import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteToolModalComponent } from './delete-tool-modal.component';

describe('DeleteToolModalComponent', () => {
  let component: DeleteToolModalComponent;
  let fixture: ComponentFixture<DeleteToolModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteToolModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteToolModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
