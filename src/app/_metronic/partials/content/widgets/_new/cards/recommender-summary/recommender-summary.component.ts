import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recommender-summary',
  templateUrl: './recommender-summary.component.html',
  styleUrls: ['./recommender-summary.component.scss'],
})
export class RecommenderSummaryComponent implements OnInit {
  @Input() cssClass: string = '';
  @Input() description: string = '';
  @Input() color: string = '';
  @Input() img: string = '';
  constructor() {}

  ngOnInit(): void {}
}
