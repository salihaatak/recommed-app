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
  private currentStateIndex: number = 0;
  private states: Array<string> = ['warning', 'primary', 'danger', 'success', 'info']

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

  getRandomState(): string {
    this.currentStateIndex = this.currentStateIndex == this.states.length - 1 ? 0 : this.currentStateIndex + 1;
    return this.states[this.currentStateIndex];
  }

  public reload (){
    const s = this.appService
    .post('recommendation/recommenders-summary')
    .subscribe((result: ApiResultModel | undefined) => {
      if (result?.success) {
        this.items = result?.data.items;
        this.items = this.items.map((item) => {
          return {
            ...item,
            state: this.getRandomState()
          }
        });
        this.stats = result?.data.count
        this.remainingCount = this.stats - result?.data.items.length;

        this.cdr.detectChanges();
      } else {
      }
    });
  }
}
