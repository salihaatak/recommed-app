import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';

@Component({
  selector: 'app-recommender-count',
  templateUrl: './recommender-count.component.html',
  styleUrls: ['./recommender-count.component.scss'],
})
export class RecommenderCountComponent implements OnInit {
  @Input() cssClass: string = '';
  @Input() icon: boolean = false;
  @Input() stats: number = 0;
  @Input() remainingCount: number = 0;
  @Input() labelColor: string = 'dark';
  @Input() textColor: string = 'gray-300';
  items: Array<{ name: string; initials?: string; state?: string, src?: string }>;

  constructor(
    public appService: AppService,
    public cdr: ChangeDetectorRef
  ) {
    appService.eventEmitter.subscribe((x)=>{
      if (x.type == 'recommender'){
        this.reload();
      }
    });
  }

  ngOnInit(): void {
    this.reload();
  }

  public reload (){
    const s = this.appService
    .post('user/recommenders-summary')
    .subscribe((result: ApiResultModel | undefined) => {
      if (result?.success) {
        this.items = result?.data.items;
        this.stats = result?.data.count
        this.remainingCount = this.stats - result?.data.items.length;

        this.cdr.detectChanges();
      } else {
      }
    });
  }
}
