import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';
import { Recommendation } from 'src/app/modules/auth/models/recommendation.model';
import { ModalConfig, ModalComponent } from '../../../..';

@Component({
  selector: 'app-recommenders',
  templateUrl: './recommenders.component.html',
})
export class RecommendersComponent implements OnInit {
  recommenders: Array<{uid: string, joinedAt: Date, name: string, total: number, sold: number, last: Date}>;
  currentRecommendationUid: string;

  @ViewChild('modalRecommendation') private modalRecommendation: ModalComponent;
  modalConfigRecommendation: ModalConfig = {
    title: 'Tavsiyenin Aşamaları',
    hideCloseButton: false,
    actions: []
  };

  constructor(
    public appService: AppService,
    private cdr: ChangeDetectorRef,
  ) {
    appService.eventEmitter.subscribe((x)=>{
      if (x.type == 'recommendation'){
        this.load();
        if (this.currentRecommendationUid) {
          //this.loadRecommender();
        }
      }
    });
  }

  ngOnInit(): void {
    this.load();

  }

  public load(){
    const s = this.appService
    .post('account/recommenders', {
      accountUid: this.appService.currentUserValue?.account.uid
    })
    .subscribe((result: ApiResultModel | undefined) => {
      if (result?.success) {
        this.recommenders = result?.data;
        this.cdr.detectChanges();
      } else {
      }
    });
  }
}
