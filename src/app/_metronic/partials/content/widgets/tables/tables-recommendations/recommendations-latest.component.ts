import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';
import { Recommendation } from 'src/app/modules/auth/models/recommendation.model';
import { ModalConfig, ModalComponent } from '../../../../../../_metronic/partials';
import { RecommendationActivityModel} from '../../../../../../models/recommendation-activity.model'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-recommendations-latest',
  templateUrl: './recommendations-latest.component.html',
})
export class RecommendationsLatestComponent implements OnInit {
  recommendations: Array<Recommendation>;
  activities: Array<RecommendationActivityModel>;
  recommendation: Recommendation = new Recommendation();
  hasError: boolean = false;
  currentRecommendationUid: string;
  loading: boolean = false;

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


  frmValidate: FormGroup;
  @ViewChild('modalValidate') private modalValidate: ModalComponent;
  modalConfigValidate: ModalConfig = {
    title: 'Tavsiye Geçerlidir',
    hideCloseButton: false,
    actions: [
      {
        title: "Tamam",
        buttonClass: 'success',
        event: async (): Promise<boolean> => {
          this.validateClick();
          return true;
        }
      }
    ]
  };

  frmInvalidate: FormGroup;
  @ViewChild('modalInvalidate') private modalInvalidate: ModalComponent;
  modalConfigInvalidate: ModalConfig = {
    title: 'Tavsiye Geçersiz',
    hideCloseButton: false,
    actions: [
      {
        title: "Tamam",
        buttonClass: 'danger',
        event: async (): Promise<boolean> => {
          this.invalidateClick();
          return true;
        }
      }
    ]
  };

  frmWithdraw: FormGroup;
  @ViewChild('modalWithdraw') private modalWithdraw: ModalComponent;
  modalConfigWithdraw: ModalConfig = {
    title: 'Tavsiyeyi Geri Çek',
    hideCloseButton: false,
    actions: [
      {
        title: "Geri Çek",
        buttonClass: 'danger',
        event: async (): Promise<boolean> => {
          this.withdrawClick();
          return true;
        }
      }
    ]
  };

  constructor(
    private fbSales: FormBuilder,
    private fbAccept: FormBuilder,
    private fbDecline: FormBuilder,
    private fbWithdraw: FormBuilder,
    private fbValidate: FormBuilder,
    private fbInalidate: FormBuilder,
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

    this.frmValidate = this.fbAccept.group(
      {
        approve: [false, Validators.compose([Validators.required])],
      },
    );

    this.frmInvalidate = this.fbDecline.group(
      {
        approve: [false, Validators.compose([Validators.required])],
      },
    );

    this.frmWithdraw = this.fbWithdraw.group(
      {
        approve: [false, Validators.compose([Validators.required])],
      },
    );
  }

  openRecommendationActivitiesModal(recommendationUid: string) {
    this.currentRecommendationUid = recommendationUid;
    this.loadRecommendation()?.add(() => {
      this.modalRecommendation.open();
    });
  }

  loadRecommendation () {
    if (this.loading) return null;
    this.loading = true;
    setTimeout(() => {this.loading = false;}, 5000);
    const r = this.appService.post("recommendation/get", {uid: this.currentRecommendationUid}).subscribe((result: ApiResultModel | undefined) => {
      this.loading = false;
      this.recommendation = result?.data.recommendation;

      this.recommendation.phoneNumber = this.recommendation.phoneNumber;

      if (this.recommendation.phoneNumberHidden) {
        this.recommendation.phoneNumber = this.appService.mask(this.recommendation.phoneNumber);
      }

      this.activities = result?.data.activities;
      this.modalConfigRecommendation.title = `Tavsiye Detayı`;

      this.modalConfigRecommendation.actions = [];

      if (this.appService.role == 'o' || this.appService.role == 'u') {
        if (this.recommendation.status == 'ac'){
          this.modalConfigRecommendation.actions.push({
              title: "Doğrula",
              buttonClass: 'success',
              event: async (): Promise<boolean> => {
                this.modalValidate.open();

                return true;
              }
          });

          this.modalConfigRecommendation.actions.push({
              title: "Geçersiz",
              buttonClass: 'danger',
              event: async (): Promise<boolean> => {
                this.modalInvalidate.open();

                return true;
              }
          });
        }

        if (!this.recommendation.withdrawnAt && !this.recommendation.acceptedAt && !this.recommendation.cancelledAt && !this.recommendation.declinedAt){
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

        if (!this.recommendation.soldAt && this.recommendation.validatedAt){
          this.modalConfigRecommendation.actions?.push({
              title: "Satış Bildir",
              buttonClass: 'success',
              event: async (): Promise<boolean> => {
                this.modalSale.open();

                return true;
              }
          });
        }
      }

      if (['ne', 'ac', 'de', 'ca', 'ta', 'va', 'in', 're'].includes(this.recommendation.status) && this.appService.role == 'r') {
        this.modalConfigRecommendation.actions.push({
            title: "Tavsiyeyi Geri Çek",
            buttonClass: 'danger',
            event: async (): Promise<boolean> => {
              this.modalWithdraw.open();

              return true;
            }
        });
      }

      this.cdr.detectChanges();
    });

    return r;
  }

  phoneCall(tel: string){
    window.location.href = 'tel:' + tel;
  }

  openSalesModal(recommendationUid: string) {
    this.loadRecommendation()?.add(() => {
      this.hasError = false;
      this.modalSale.open();

      this.cdr.detectChanges();
    });
  }

  saleClick() {
    this.hasError = false;
    if (this.frmSales.controls["salesAmount"].value && this.frmSales.controls["approve"].value) {
      this.hasError = false;

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
            this.hasError = true;
          }
        });

    } else {
      this.hasError = true;
    }
  }

  openAcceptModal(recommendationUid: string) {
    this.loadRecommendation()?.add(() => {
      this.hasError = false;
      this.modalAccept.open();

      this.cdr.detectChanges();
    });
  }

  acceptClick() {
    this.hasError = false;
    if (this.frmAccept.controls["approve"].value) {
      this.hasError = false;

      const s = this.appService
        .post('recommendation/accept', {
          uid: this.currentRecommendationUid
        })
        .subscribe((result: ApiResultModel | undefined) => {
          if (result){
            this.appService.eventEmitter.emit({type: 'recommendation'});
            this.modalAccept.close();
          } else {
            this.hasError = true;
          }
        });
    } else {
      this.hasError = true;
    }
  }

  declineClick() {
    this.hasError = false;
    if (this.frmDecline.controls["approve"].value) {
      this.hasError = false;

      const s = this.appService
        .post('recommendation/decline', {
          uid: this.currentRecommendationUid
        })
        .subscribe((result: ApiResultModel | undefined) => {
          if (result){
            this.appService.eventEmitter.emit({type: 'recommendation'});
            this.modalDecline.close();
          } else {
            this.hasError = true;
          }
        });
    } else {
      this.hasError = true;
    }
  }

  validateClick() {
    this.hasError = false;
    if (this.frmValidate.controls["approve"].value) {
      this.hasError = false;

      const s = this.appService
        .post('recommendation/validate', {
          uid: this.currentRecommendationUid
        })
        .subscribe((result: ApiResultModel | undefined) => {
          if (result){
            this.appService.eventEmitter.emit({type: 'recommendation'});
            this.modalValidate.close();
          } else {
            this.hasError = true;
          }
        });
    } else {
      this.hasError = true;
    }
  }

  invalidateClick() {
    this.hasError = false;
    if (this.frmInvalidate.controls["approve"].value) {
      this.hasError = false;

      const s = this.appService
        .post('recommendation/invalidate', {
          uid: this.currentRecommendationUid
        })
        .subscribe((result: ApiResultModel | undefined) => {
          if (result){
            this.appService.eventEmitter.emit({type: 'recommendation'});
            this.modalInvalidate.close();
          } else {
            this.hasError = true;
          }
        });
    } else {
      this.hasError = true;
    }
  }

  withdrawClick() {
    this.hasError = false;
    if (this.frmWithdraw.controls["approve"].value) {
      this.hasError = false;

      const s = this.appService
        .post('recommendation/withdraw', {
          uid: this.currentRecommendationUid
        })
        .subscribe((result: ApiResultModel | undefined) => {
          if (result){
            this.appService.eventEmitter.emit({type: 'recommendation'});
            this.modalWithdraw.close();
          } else {
            this.hasError = true;
          }
        });
    } else {
      this.hasError = true;
    }
  }

  public loadRecommendations(){
    const s = this.appService
    .post(this.appService.role == 'o' ? 'recommendation/provider-recommendations' : 'recommendation/recommender-recommendations')
    .subscribe((result: ApiResultModel | undefined) => {
      if (result?.success) {
        this.recommendations = result?.data;
        this.cdr.detectChanges();
      } else {
      }
    });
  }

}
