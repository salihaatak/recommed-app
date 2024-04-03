import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';

@Component({
  selector: 'app-recommender-journey',
  templateUrl: './recommender-journey.component.html',
  styleUrls: ['./recommender-journey.component.scss'],
})
export class RecommenderJourneyComponent implements OnInit {
  @Input() cssClass: string = '';
  @Input() description: string = '';
  @Input() color: string = '';
  @Input() img: string = '';

  constructor(
     public appService: AppService,
     public cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }


}
