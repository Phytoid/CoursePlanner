import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCoursePlanComponent } from './view-course-plan.component';

describe('ViewCoursePlanComponent', () => {
  let component: ViewCoursePlanComponent;
  let fixture: ComponentFixture<ViewCoursePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCoursePlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCoursePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
