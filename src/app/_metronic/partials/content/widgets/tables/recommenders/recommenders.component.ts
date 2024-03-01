import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';
import { Recommendation } from 'src/app/modules/auth/models/recommendation.model';
import { ModalConfig, ModalComponent } from '../../../..';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-recommenders',
  templateUrl: './recommenders.component.html',
})
export class RecommendersComponent implements OnInit {
  loading: boolean = false;
  recommenders: Array<{
    uid: string,
    joinedAt: Date,
    name: string,
    total: number,
    sold: number,
    last: Date,
    role: 'o' | 'u' | 'r',
    salesRewardPercentage: number
  }>;
  error: any;
  currentRecommenderUid: string;

  frmUserEdit: FormGroup;
  @ViewChild('modalUserEdit') private modalUserEdit: ModalComponent;
  modalConfigUserEdit: ModalConfig = {
    title: 'Marka Elçisi Ayarları',
    hideCloseButton: false,
    actions: [ {
        title: "Kaydet",
        event: async (): Promise<boolean> => {
          this.recommenderSaveClick();
          return true;
        }
    }]
  };

  constructor(
    public appService: AppService,
    private cdr: ChangeDetectorRef,
    private fbUserEdit: FormBuilder,
  ) {
    appService.eventEmitter.subscribe((x)=>{
      if (x.type == 'recommendation'){
        this.load();
      }
    });
  }

  ngOnInit(): void {
    this.load();
    this.frmUserEdit = this.fbUserEdit.group(
      {
        salesRewardPercentage: [],
        role: [],
        firstName: [],
        lastName: [],
      },
    );
  }


  openRecommenderEditModal(userUid: string) {
    if (this.loading) return null;
    this.loading = true;
    setTimeout(() => {this.loading = false;}, 5000);
    if (this.appService.currentUserValue?.role == 'o') {
      const s = this.appService.post('user/get-recommender', {
        uid: userUid,
      })
      .subscribe((result: ApiResultModel | undefined) => {
        this.loading = false;
        this.currentRecommenderUid = userUid;

        this.frmUserEdit.setValue({
          role: result?.data?.role,
          salesRewardPercentage: result?.data?.salesRewardPercentage,
          firstName: result?.data?.firstName,
          lastName: result?.data?.lastName,
        });
        this.modalUserEdit.open();

        this.cdr.detectChanges();
      });
    }
  }

  recommenderSaveClick() {
    this.error = null;

    const s = this.appService
      .post('user/update-recommender', {
        uid: this.currentRecommenderUid,
        role: this.frmUserEdit.controls["role"].value,
        firstName: this.frmUserEdit.controls["firstName"].value,
        lastName: this.frmUserEdit.controls["lastName"].value,
        salesRewardPercentage: this.frmUserEdit.controls["salesRewardPercentage"].value,
      })
      .subscribe((result: ApiResultModel | undefined) => {
        if (result){
          this.appService.eventEmitter.emit({type: 'recommendation'});
          this.modalUserEdit.close();
        } else {
          this.error = "Lütfen formu kontrol edin";
        }
      });

  }

  public load(){
    const s = this.appService
    .post('user/recommenders', {
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
