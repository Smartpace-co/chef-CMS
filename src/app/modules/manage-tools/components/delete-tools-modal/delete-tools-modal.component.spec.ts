import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteToolsModalComponent } from './delete-tools-modal.component';

describe('DeleteToolsModalComponent', () => {
  let component: DeleteToolsModalComponent;
  let fixture: ComponentFixture<DeleteToolsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteToolsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteToolsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
