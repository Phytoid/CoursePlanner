import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentTrendsComponent } from './enrollment-trends.component';

describe('EnrollmentTrendsComponent', () => {
  let component: EnrollmentTrendsComponent;
  let fixture: ComponentFixture<EnrollmentTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentTrendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
