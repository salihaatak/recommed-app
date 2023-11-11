import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderSummaryComponent } from './provider-summary.component';

describe('CardsWidget20Component', () => {
  let component: ProviderSummaryComponent;
  let fixture: ComponentFixture<ProviderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
