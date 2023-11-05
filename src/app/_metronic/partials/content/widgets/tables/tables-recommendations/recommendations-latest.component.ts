import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ApiService } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';
import { Recommendation } from 'src/app/modules/auth/models/recommendation.model';

@Component({
  selector: 'app-recommendations-latest',
  templateUrl: './recommendations-latest.component.html',
})
export class RecommendationsLatestComponent implements OnInit {
  recommendations: Array<Recommendation>;

  constructor(
    public apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone // NgZone servisini enjekte edin
  ) {
    apiService.eventEmitter.subscribe((x)=>{
      if (x.type == 'recommendation'){
        this.reload();
      }
    });
  }

  ngOnInit(): void {
    this.reload();
  }

  public reload (){
    const s = this.apiService
    .post('user/recommendations')
    .subscribe((result: ApiResultModel | undefined) => {
      if (result?.success) {
        this.recommendations = result?.data;
        this.cdr.detectChanges();
        console.log("Kendimi güncelledim!");
      } else {
      }
    });
  }
}
