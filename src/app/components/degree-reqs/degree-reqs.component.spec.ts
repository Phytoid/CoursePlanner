import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegreeReqsComponent } from './degree-reqs.component';

describe('DegreeReqsComponent', () => {
  let component: DegreeReqsComponent;
  let fixture: ComponentFixture<DegreeReqsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DegreeReqsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DegreeReqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
