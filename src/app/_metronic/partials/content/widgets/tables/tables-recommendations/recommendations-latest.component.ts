import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';
import { Recommendation } from 'src/app/modules/auth/models/recommendation.model';
import { ModalConfig, ModalComponent } from '../../../../../../_metronic/partials';
import { RecommendationActivityModel} from '../../../../../../models/recommendation-activity.model'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recommendations-latest',
  templateUrl: './recommendations-latest.component.html',
})
export class RecommendationsLatestComponent implements OnInit {
  recommendations: Array<Recommendation>;
  activities: Array<RecommendationActivityModel>;
  recommendation: Recommendation = new Recommendation();
  hasErrorSales: boolean = false;
  currentRecommendationUid: string;

  @ViewChild('modalRecommendation') private modalRecommendation: ModalComponent;
  modalConfigRecommendation: ModalConfig = {
    title: 'Tavsiyenin Aşamaları',
    hideCloseButton: false,
    actions: []
  };

  frmSales: FormGroup;
  @ViewChild('modalSale') private modalSale: ModalComponent;
  modalConfigSale: ModalConfig = {
    title: 'Satış Kaydı',
    hideCloseButton: false,
    actions: [ {
        title: "Kaydet",
        event: async (): Promise<boolean> => {
          this.saleClick();
          return true;
        }
    }]
  };

  frmAccept: FormGroup;
  @ViewChild('modalAccept') private modalAccept: ModalComponent;
  modalConfigAccept: ModalConfig = {
    title: 'Tavsiye Kabul',
    hideCloseButton: false,
    actions: [
      {
        title: "Kabul Et",
        buttonClass: 'success',
        event: async (): Promise<boolean> => {
          this.acceptClick();
          return true;
        }
      }
    ]
  };

  frmDecline: FormGroup;
  @ViewChild('modalDecline') private modalDecline: ModalComponent;
  modalConfigDecline: ModalConfig = {
    title: 'Tavsiyeyi Reddet',
    hideCloseButton: false,
    actions: [
      {
        title: "Reddet",
        buttonClass: 'danger',
        event: async (): Promise<boolean> => {
          this.declineClick();
          return true;
        }
      }
    ]
  };

  constructor(
    private fbSales: FormBuilder,
    private fbAccept: FormBuilder,
    private fbDecline: FormBuilder,
    public appService: AppService,
    private cdr: ChangeDetectorRef,
  ) {
    appService.eventEmitter.subscribe((x)=>{
      if (x.type == 'recommendation'){
        this.loadRecommendations();
        if (this.currentRecommendationUid) {
          this.loadRecommendation();
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadRecommendations();

    this.frmSales = this.fbSales.group(
      {
        salesAmount: [
          0,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        approve: [false, Validators.compose([Validators.required])],
      },
    );

    this.frmAccept = this.fbAccept.group(
      {
        approve: [false, Validators.compose([Validators.required])],
      },
    );

    this.frmDecline = this.fbDecline.group(
      {
        approve: [false, Validators.compose([Validators.required])],
      },
    );
  }

  openRecommendationActivitiesModal(recommendationUid: string) {
    this.currentRecommendationUid = recommendationUid;
    this.loadRecommendation().add(() => {
      this.modalRecommendation.open();
    });
  }

  loadRecommendation () {
    return this.appService.post("recommendation/get", {uid: this.currentRecommendationUid}).subscribe((result: ApiResultModel | undefined) => {
      this.recommendation = result?.data.recommendation;
      this.activities = result?.data.activities;
      this.modalConfigRecommendation.title = `Tavsiye Detayı`;

      this.modalConfigRecommendation.actions = [];

      if (!this.recommendation.acceptedAt && !this.recommendation.cancelledAt && !this.recommendation.declinedAt){
        this.modalConfigRecommendation.actions.push({
            title: "Kabul Et",
            buttonClass: 'success',
            event: async (): Promise<boolean> => {
              this.modalAccept.open();

              return true;
            }
        });

        this.modalConfigRecommendation.actions.push({
            title: "Reddet",
            buttonClass: 'danger',
            event: async (): Promise<boolean> => {
              this.modalDecline.open();

              return true;
            }
        });
      }

      if (!this.recommendation.soldAt && (this.recommendation.acceptedAt || this.recommendation.verifiedAt)){
        this.modalConfigRecommendation.actions?.push({
            title: "Satış Kaydet",
            event: async (): Promise<boolean> => {
              this.modalSale.open();

              return true;
            }
        });
      }

      this.cdr.detectChanges();

      //burası
    });
  }

  openSalesModal(recommendationUid: string) {
    this.loadRecommendation().add(() => {
      this.hasErrorSales = false;
      this.modalSale.open();

      this.cdr.detectChanges();


    });
  }

  saleClick() {
    this.hasErrorSales = false;
    if (this.frmSales.controls["salesAmount"].value && this.frmSales.controls["approve"].value) {
      this.hasErrorSales = false;

      const s = this.appService
        .post('recommendation/sale', {
          uid: this.currentRecommendationUid,
          salesAmount: this.frmSales.controls["salesAmount"].value
        })
        .subscribe((result: ApiResultModel | undefined) => {
          if (result){
            this.appService.eventEmitter.emit({type: 'recommendation'});
            this.modalSale.close();
          } else {
            this.hasErrorSales = true;
          }
        });

    } else {
      this.hasErrorSales = true;
    }
  }

  openAcceptModal(recommendationUid: string) {
    this.loadRecommendation().add(() => {
      this.hasErrorSales = false;
      this.modalAccept.open();

      this.cdr.detectChanges();
    });
  }

  acceptClick() {
    this.hasErrorSales = false;
    if (this.frmAccept.controls["approve"].value) {
      this.hasErrorSales = false;

      const s = this.appService
        .post('recommendation/accept', {
          uid: this.currentRecommendationUid
        })
        .subscribe((result: ApiResultModel | undefined) => {
          if (result){
            this.appService.eventEmitter.emit({type: 'recommendation'});
            this.modalAccept.close();
          } else {
            this.hasErrorSales = true;
          }
        });
    } else {
      this.hasErrorSales = true;
    }
  }

  declineClick() {
    this.hasErrorSales = false;
    if (this.frmDecline.controls["approve"].value) {
      this.hasErrorSales = false;

      const s = this.appService
        .post('recommendation/decline', {
          uid: this.currentRecommendationUid
        })
        .subscribe((result: ApiResultModel | undefined) => {
          if (result){
            this.appService.eventEmitter.emit({type: 'recommendation'});
            this.modalDecline.close();
          } else {
            this.hasErrorSales = true;
          }
        });
    } else {
      this.hasErrorSales = true;
    }
  }

  public loadRecommendations(){
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
