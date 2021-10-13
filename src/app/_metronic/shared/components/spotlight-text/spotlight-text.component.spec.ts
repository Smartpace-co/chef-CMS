import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotlightTextComponent } from './spotlight-text.component';

describe('SpotlightTextComponent', () => {
  let component: SpotlightTextComponent;
  let fixture: ComponentFixture<SpotlightTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotlightTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotlightTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
