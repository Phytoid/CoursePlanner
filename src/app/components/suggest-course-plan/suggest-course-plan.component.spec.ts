import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestCoursePlanComponent } from './suggest-course-plan.component';

describe('SuggestCoursePlanComponent', () => {
  let component: SuggestCoursePlanComponent;
  let fixture: ComponentFixture<SuggestCoursePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestCoursePlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestCoursePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
