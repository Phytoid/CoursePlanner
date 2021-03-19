import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpdComponent } from './gpd.component';

describe('GpdComponent', () => {
  let component: GpdComponent;
  let fixture: ComponentFixture<GpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
