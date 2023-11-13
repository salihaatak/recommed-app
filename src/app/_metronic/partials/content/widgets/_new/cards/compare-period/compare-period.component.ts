import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../../kt/_utils';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';

@Component({
  selector: 'app-compare-period',
  templateUrl: './compare-period.component.html',
  styleUrls: ['./compare-period.component.scss'],
})
export class ComparePeriodComponent implements OnInit {
  chartOptions: any = {};

  @Input() cssClass: string = '';
  @Input() chartSize: number = 70;
  @Input() chartLine: number = 11;
  @Input() chartRotate?: number = 145;

  previousCount: number = 0;
  lastCount: number = 0;
  changeType: string = 's';
  changePercentage: number = 0;
  lastPeriodPurchased: number = 0;
  lastPeriodPurchasedPercentage1: number = 0;
  lastPeriodVerified: number = 0;
  lastPeriodVerifiedPercentage1: number = 0;
  lastPeriodOther: number = 0;

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
    .post('user/compare-period')
    .subscribe((result: ApiResultModel | undefined) => {
      if (result?.success) {
        this.previousCount = result?.data.previousCount;
        this.lastCount = result?.data.lastCount;
        this.changeType = result?.data.changeType;
        this.changePercentage = result?.data.changePercentage | 0;
        this.lastPeriodPurchased = result?.data.lastPeriodPurchased;
        this.lastPeriodPurchasedPercentage1 = this.lastPeriodPurchased / this.lastCount;
        this.lastPeriodVerified = result?.data.lastPeriodVerified;
        this.lastPeriodVerifiedPercentage1 = this.lastPeriodVerified / this.lastCount;
        this.lastPeriodOther = result?.data.lastPeriodOther;

        this.cdr.detectChanges();

        this.initChart(this.chartSize, this.chartLine, this.chartRotate);

      } else {
      }
    });
  }


public initChart (
    chartSize: number = 70,
    chartLine: number = 11,
    chartRotate: number = 145
  ) {
    const el = document.getElementById('kt_card_widget_17_chart');

    if (!el) {
      return;
    }

    var options = {
      size: chartSize,
      lineWidth: chartLine,
      rotate: chartRotate,
      //percent:  el.getAttribute('data-kt-percent') ,
    };

    const canvas = document.createElement('canvas');
    const span = document.createElement('span');

    // @ts-ignore
    if (typeof G_vmlCanvasManager !== 'undefined') {
      // @ts-ignore
      G_vmlCanvasManager.initElement(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = options.size;

    el.appendChild(span);
    el.appendChild(canvas);

    // @ts-ignore
    ctx.translate(options.size / 2, options.size / 2); // change center
    // @ts-ignore
    ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

    //imd = ctx.getImageData(0, 0, 240, 240);
    const radius = (options.size - options.lineWidth) / 2;

    const drawCircle = function (
      color: string,
      lineWidth: number,
      percent: number
    ) {
      percent = Math.min(Math.max(0, percent || 1), 1);
      if (!ctx) {
        return;
      }

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
      ctx.strokeStyle = color;
      ctx.lineCap = 'round'; // butt, round or square
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    // Init
    drawCircle('#E4E6EF', options.lineWidth, 100 / 100);

    drawCircle(getCSSVariableValue('--bs-primary'), options.lineWidth, this.lastPeriodPurchasedPercentage1 + this.lastPeriodVerifiedPercentage1);
    drawCircle(getCSSVariableValue('--bs-success'), options.lineWidth, this.lastPeriodPurchasedPercentage1);

    /*
    if (this.lastPeriodPurchasedPercentage1 > this.lastPeriodVerifiedPercentage1) {
      drawCircle(getCSSVariableValue('--bs-primary'), options.lineWidth, this.lastPeriodPurchasedPercentage1);
      drawCircle(getCSSVariableValue('--bs-success'), options.lineWidth, this.lastPeriodVerifiedPercentage1);
    } else {
      drawCircle(getCSSVariableValue('--bs-success'), options.lineWidth, this.lastPeriodVerifiedPercentage1);
      drawCircle(getCSSVariableValue('--bs-primary'), options.lineWidth, this.lastPeriodPurchasedPercentage1);
    }
    */
  };
}

