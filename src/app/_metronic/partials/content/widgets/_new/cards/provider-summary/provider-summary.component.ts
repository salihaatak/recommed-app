import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';

@Component({
  selector: 'app-provider-summary',
  templateUrl: './provider-summary.component.html',
  styleUrls: ['./provider-summary.component.scss'],
})
export class ProviderSummaryComponent implements OnInit {
  @Input() cssClass: string = '';
  @Input() color: string = '';
  @Input() img: string = '';

  summary: any = {};
  percentage: string;

  constructor(
     public appService: AppService,
     public cdr: ChangeDetectorRef
  ) {
    appService.eventEmitter.subscribe((x)=>{
      if (x.type == 'recommendation'){
        this.reload();
      }
    });

  }

  ngOnInit(): void {
    this.reload();
  }

  public reload (){
    const s = this.appService
    .post('user/provider-summary')
    .subscribe((result: ApiResultModel | undefined) => {
      if (result?.success) {
        this.summary = result?.data;
        const _percentage = Math.round(this.summary.purchasedCount * 100 / this.summary.recommendationCount);
        this.percentage = _percentage > 0 ? `${_percentage}%` : `1%`;
        this.cdr.detectChanges();
      } else {
      }
    });
  }
}
