import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommenderCountComponent } from './recommender-count.component';

describe('CardsWidget7Component', () => {
  let component: RecommenderCountComponent;
  let fixture: ComponentFixture<RecommenderCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommenderCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommenderCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
