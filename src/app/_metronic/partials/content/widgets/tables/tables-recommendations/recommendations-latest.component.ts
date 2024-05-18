import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';
import { Recommendation } from 'src/app/modules/auth/models/recommendation.model';
import { ModalConfig, ModalComponent } from '../../../../../../_metronic/partials';
import { RecommendationActionModel} from '../../../../../../models/recommendation-activity.model'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-recommendations-latest',
  templateUrl: './recommendations-latest.component.html',
})
export class RecommendationsLatestComponent implements OnInit {
  recommendations: Array<Recommendation>;
  actions: Array<RecommendationActionModel>;
  recommendation: Recommendation = new Recommendation();
  hasError: boolean = false;
  currentRecommendationUid: string;
  loading: boolean = false;

  @ViewChild('modalRecommendation') private modalRecommendation: ModalComponent;
  modalConfigRecommendation: ModalConfig = {
    title: 'Başvurunun Aşamaları',
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
    title: 'Başvuru Kabul',
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
    title: 'Başvuruyu Reddet',
    hideCloseButton: false,
    actions: [
      {
        title: "İptal Et",
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
    title: 'Başvuru Geçerlidir',
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
    title: 'Başvuru Geçersiz',
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
    title: 'Başvuruyu Geri Çek',
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
      },
    );

    this.frmAccept = this.fbAccept.group(
      {
        approve: [false, Validators.compose([Validators.required])],
      },
    );

    this.frmDecline = this.fbDecline.group(
      {
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

  openRecommendationActionsModal(recommendationUid: string) {
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

      this.actions = result?.data.actions;
      this.modalConfigRecommendation.title = `Başvuru Detayı`;

      this.modalConfigRecommendation.actions = [];

      if (this.appService.role == 'o' || this.appService.role == 'u') {
        if (this.actions.filter(x=>x.action == 'recommendation-decline').length == 0 && this.actions.filter(x=>x.action == 'sale').length == 0) {
          this.modalConfigRecommendation.actions.push({
              title: "İptal Et",
              buttonClass: 'danger',
              event: async (): Promise<boolean> => {
                this.modalDecline.open();
                return true;
              }
          });

          if (this.actions.filter(x=>x.action == 'sale').length == 0){
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
    if (this.frmSales.controls["salesAmount"].value) {
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
