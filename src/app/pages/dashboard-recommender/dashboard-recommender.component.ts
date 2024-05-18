import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { AppService, UserType } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-recommender.component.html',
  styleUrls: ['./dashboard-recommender.component.scss'],
})
export class DashboardRecommenderComponent implements OnInit {
  user: UserType;

  constructor(
    public appService: AppService,
    public cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.appService.eventEmitter.subscribe((x)=>{
      if (x.type == 'recommendation'){
        setTimeout(() => {
          this.load();
        }, 1000);
      }
    });

    this.load();
  }

  load (){
    this.user = this.appService.currentUserValue;

    const s = this.appService
    .post('action/get-journey')
    .subscribe((result: ApiResultModel | undefined) => {
      if (result?.success) {
        this.appService.recommenderJourney = result?.data;

        if (this.appService.recommenderJourney.filter(x=>x.action == 'recommender-video').length == 0){
          this.appService.recommenderJourneyStep = 1;
          this.appService.recommenderJourneyInstruction = "Şimdi yapman gereken: Tüyoları öğreneceğin kısa videoyu izle.";
        } else if (this.appService.recommenderJourney.filter(x=>x.action == 'recommendation').length == 0){
          this.appService.recommenderJourneyStep = 2;
          this.appService.recommenderJourneyInstruction = "Şimdi yapman gereken: Paylaş düğmesine dokun. Linki çevrene ulaştır. Linkteki formu doldurmalarını öner. Numarasını bırakanları arayacağız ve ücretsiz olan muayeneye gelmeleri için randevu vereceğiz.";
        } else {
          this.appService.recommenderJourneyStep = 3;
        }

        if (this.appService.recommenderJourney.filter(x=>x.action == 'sale').length > 0){
          this.appService.recommenderJourneyStep += 25;
        }

        this.cdr.detectChanges();
      } else {
      }
    });
  }

}
