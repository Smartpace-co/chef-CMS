import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionFieldsComponent } from './description-fields.component';

describe('DescriptionFieldsComponent', () => {
  let component: DescriptionFieldsComponent;
  let fixture: ComponentFixture<DescriptionFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
