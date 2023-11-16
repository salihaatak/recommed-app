import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';
import { Recommendation } from 'src/app/modules/auth/models/recommendation.model';
import { ModalConfig, ModalComponent } from '../../../../../../_metronic/partials';
import { RecommendationActivityModel} from '../../../../../../models/recommendation-activity.model'

@Component({
  selector: 'app-recommendations-latest',
  templateUrl: './recommendations-latest.component.html',
})
export class RecommendationsLatestComponent implements OnInit {
  @Input() role: 'r' | 'o' | 'u';

  recommendations: Array<Recommendation>;
  recommendationActivities: Array<RecommendationActivityModel>

  modalConfigRecommendationHistory: ModalConfig = {
    modalTitle: 'Tavsiyenin Aşamaları',
    hideDismissButton: () => true,
    hideCloseButton: () => true,
  };
  @ViewChild('modalRecommendationHistory') private modalRecommendationHistory: ModalComponent;

  constructor(
    public appService: AppService,
    private cdr: ChangeDetectorRef,
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

  openRecommendationHistoryModal(recommendationUid: string) {
    this.appService.post("recommendation/get", {uid: recommendationUid}).subscribe((result: ApiResultModel | undefined) => {
      this.modalConfigRecommendationHistory.modalTitle = 'Tavsiye: ' + result?.data.recommendation.name;
      this.modalRecommendationHistory.open();

      this.recommendationActivities = result?.data.activities;

      this.cdr.detectChanges();
    })
  }

  public reload (){
    const s = this.appService
    .post(this.appService.role == 'r' ? 'user/recommender-recommendations' : 'user/provider-recommendations')
    .subscribe((result: ApiResultModel | undefined) => {
      if (result?.success) {
        this.recommendations = result?.data;
        this.cdr.detectChanges();
      } else {
      }
    });
  }
}
