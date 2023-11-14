import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';
import { Recommendation } from 'src/app/modules/auth/models/recommendation.model';
import { ModalConfig, ModalComponent } from '../../../../../../_metronic/partials';

@Component({
  selector: 'app-recommendations-latest',
  templateUrl: './recommendations-latest.component.html',
})
export class RecommendationsLatestComponent implements OnInit {
  recommendations: Array<Recommendation>;

  modalConfigRecommendationHistory: ModalConfig = {
    modalTitle: 'Tavsiye Aşamaları',
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
    this.modalRecommendationHistory.open();
    this.appService.post("recommendation/get", {uid: recommendationUid}).subscribe((result: ApiResultModel | undefined) => {
      //...

      this.cdr.detectChanges();
    })
  }

  public reload (){
    const s = this.appService
    .post('user/recommendations')
    .subscribe((result: ApiResultModel | undefined) => {
      if (result?.success) {
        this.recommendations = result?.data;
        this.cdr.detectChanges();
      } else {
      }
    });
  }
}
