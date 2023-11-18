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
  recommendation: Recommendation;
  frmSales: FormGroup;
  frmAccept: FormGroup;
  hasErrorSales: boolean = false;
  currentRecommendationUid: string;

  @ViewChild('modalActivities') private modalActivities: ModalComponent;
  modalConfigActivities: ModalConfig = {
    title: 'Tavsiyenin Aşamaları',
    hideCloseButton: false,
    actions: []
  };

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

  @ViewChild('modalAccept') private modalAccept: ModalComponent;
  modalConfigAccept: ModalConfig = {
    title: 'Tavsiye Kabul',
    hideCloseButton: false,
    actions: [ {
        title: "Kabul Et",
        event: async (): Promise<boolean> => {
          this.acceptClick();
          return true;
        }
    }]
  };

  constructor(
    private fbSales: FormBuilder,
    private fbAccept: FormBuilder,
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


  }

  openRecommendationActivitiesModal(recommendationUid: string) {
    this.currentRecommendationUid = recommendationUid;
    this.loadRecommendation().add(() => {
      this.modalActivities.open();
    });
  }

  loadRecommendation () {
    return this.appService.post("recommendation/get", {uid: this.currentRecommendationUid}).subscribe((result: ApiResultModel | undefined) => {
      this.recommendation = result?.data.recommendation;
      this.activities = result?.data.activities;
      this.modalConfigActivities.title = `Tavsiye: ${result?.data.recommendation.name}`;

      this.modalConfigActivities.actions = [];

      if (!this.recommendation.acceptedAt){
        this.modalConfigActivities.actions.push({
            title: "Tavsiyeyi Kabul Et",
            event: async (): Promise<boolean> => {
              this.modalAccept.open();

              return true;
            }
        });
      }

      if (this.recommendation.acceptedAt || this.recommendation.verifiedAt){
        this.modalConfigActivities.actions?.push({
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
