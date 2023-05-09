import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighChartsVisComponent } from './high-charts-vis.component';

describe('HighChartsVisComponent', () => {
  let component: HighChartsVisComponent;
  let fixture: ComponentFixture<HighChartsVisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighChartsVisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighChartsVisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
