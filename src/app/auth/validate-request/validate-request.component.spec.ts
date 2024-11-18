import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateRequestComponent } from './validate-request.component';

describe('ValidateRequestComponent', () => {
  let component: ValidateRequestComponent;
  let fixture: ComponentFixture<ValidateRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateRequestComponent]
    });
    fixture = TestBed.createComponent(ValidateRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
