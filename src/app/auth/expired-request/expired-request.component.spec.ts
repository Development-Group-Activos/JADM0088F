import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredRequestComponent } from './expired-request.component';

describe('ExpiredRequestComponent', () => {
  let component: ExpiredRequestComponent;
  let fixture: ComponentFixture<ExpiredRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpiredRequestComponent]
    });
    fixture = TestBed.createComponent(ExpiredRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
