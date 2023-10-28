import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommenderSummaryComponent } from './recommender-summary.component';

describe('CardsWidget20Component', () => {
  let component: RecommenderSummaryComponent;
  let fixture: ComponentFixture<RecommenderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommenderSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommenderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
