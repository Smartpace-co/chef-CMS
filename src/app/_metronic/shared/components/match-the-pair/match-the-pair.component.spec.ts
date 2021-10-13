import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchThePairComponent } from './match-the-pair.component';

describe('SpotlightTextComponent', () => {
  let component: MatchThePairComponent;
  let fixture: ComponentFixture<MatchThePairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchThePairComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchThePairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
