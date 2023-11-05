import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/modules/auth';

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


  constructor(
     public apiService: ApiService
  ) {}

  ngOnInit(): void {
  }
}
