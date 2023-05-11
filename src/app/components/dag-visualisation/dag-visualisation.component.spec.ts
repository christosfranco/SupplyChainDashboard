import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DagVisualisationComponent } from './dag-visualisation.component';

describe('DagVisualisationComponent', () => {
  let component: DagVisualisationComponent;
  let fixture: ComponentFixture<DagVisualisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DagVisualisationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DagVisualisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
