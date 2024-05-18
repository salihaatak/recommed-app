import { ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../core/layout.service';
import { ModalConfig, ModalComponent } from '../../../../../_metronic/partials';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

declare global {
  interface Window { WebView: any; }
  interface Window { selectContactsCallbackTS: any; }
  interface Window { getLocationCallbackTS: any; }
}
@Component({
  selector: 'app-classic',
  templateUrl: './classic.component.html',
  styleUrls: ['./classic.component.scss'],
})
export class ClassicComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  appToolbarPrimaryButton: boolean;
  appToolbarPrimaryButtonLabel: string = '';
  appToolbarPrimaryButtonUrl: string = '';
  appToolbarPrimaryButtonModal: string = '';
  appToolbarSecondaryButton: boolean;
  appToolbarFixedDesktop: boolean;
  appToolbarSecondaryButtonLabel: string = '';
  appToolbarSecondaryButtonUrl: string = '';
  appToolbarSecondaryButtonModal: string = '';
  appToolbarFilterButton: boolean;
  appToolbarDaterangepickerButton: boolean;
  secondaryButtonClass: string = '';
  filterButtonClass: string = '';
  daterangepickerButtonClass: string = '';

  showToolbar: boolean = true;;

  @ViewChild('modalRecommenderVideo') private modalRecommenderVideo: ModalComponent;
  modalConfigRecommenderVideo: ModalConfig = {
    title: 'Tüm İpuçları Bu Videoda',
    hideCloseButton: false,
    actions: [
      {
        title: "Kapat: Videoyu İzledim",
        buttonClass: 'success',
        event: async (): Promise<boolean> => {
          this.recommenderVideoWatchedClick();
          return true;
        }
      }
    ]
  };

  @ViewChild('modalRecommender') private modalRecommender: ModalComponent;
  modalConfigRecommender: ModalConfig = {
    title: 'Paylaş',
    hideCloseButton: false,
  };

  @ViewChild('modalQrRecommend') private modalQrRecommend: ModalComponent;
  modalConfigQrRecommend: ModalConfig = {
    title: 'Kare Kodu Kameranıza Gösterin',
    hideCloseButton: false,
  };
  urlRecommend: string;

  @ViewChild('modalQrInvite') private modalQrInvite: ModalComponent;
  modalConfigQrInvite: ModalConfig = {
    title: 'Kare Kodu Kameranıza Gösterin',
    hideCloseButton: false,
  };
  urlInvite: string;
  invitationCode: string | undefined;

  constructor(
      private layout: LayoutService,
      private zone: NgZone,
      private cdr: ChangeDetectorRef,
      public appService: AppService,
      private router: Router
      ) {}

  ngOnInit(): void {
    this.invitationCode = this.appService.currentUserValue?.account.invitationCode;

    //eğer kullanıcı hesabım bölümündeyse toolbar'ı gizle
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showToolbar = this.router.url.indexOf('/me/') >= 0 ? false : true;
        this.cdr.detectChanges();
      }
    });

    this.updateProps();
    const subscr = this.layout.layoutConfigSubject
      .asObservable()
      .subscribe(() => {
        this.updateProps();
      });
    this.unsubscribe.push(subscr);

    window.selectContactsCallbackTS = {
      zone: this.zone,
      componentFn: (val: any) => {
        this.modalRecommender.close();
        if (val && val.length) {
          this.appService.post("recommendation/add-bulk", val).subscribe((result: ApiResultModel | undefined) => {
            this.appService.eventEmitter.emit({type: 'recommendation'});
          })
          this.cdr.detectChanges();
        }
      },
      component: this
    }
  }

  async openModalRecommenderVideo() {
    return await this.modalRecommenderVideo.open();
  }

  async openModalRecommender() {
    return await this.modalRecommender.open();
  }

  async recommenderVideoWatchedClick(){
    const s = this.appService
    .post('action/recommender-watched-video')
    .subscribe((result: ApiResultModel | undefined) => {
      if (result?.success) {
        this.modalRecommenderVideo.close();
      } else {
      }
    });
  }


  btnSelectContactsClick(){
    window.WebView.postMessage(JSON.stringify({
      type: "selectContacts",
      title: "Telefon Rehberim",
      max: 20,
      text: "Seçtiğiniz kişilerin numaraları işletmeye iletilecektir. Bu numaraları paylaşarak Kullanım Koşullarımızı kabul etmiş oluyorsunuz. Tek seferden en fazla 20 tane numara seçebilirsiniz.",
      buttonText: "Gönder"
    }))
  }

  btnShareRecommenderClick(){
    this.urlRecommend = `${environment.appUrl}l/r/${this.appService.currentUserValue?.uid}`;
    console.log(this.urlRecommend);
    window.WebView.postMessage(JSON.stringify({
      type: "nativeShare",
      text: "Bu işletmeden hizmet aldım ve çok memnun kaldım. İncelemek için linke dokunabilirsin.",
      link: this.urlRecommend,
      image: "https://recommed.co/app/assets/media/misc/intro.webp"
    }))
  }

  btnShareProviderClick(){
    this.urlInvite = `${environment.appUrl}l/i/${this.appService.currentUserValue?.account.invitationCode}/${this.appService.currentUserValue?.uid}`;
    console.log(this.urlInvite);
    window.WebView.postMessage(JSON.stringify({
      type: "nativeShare",
      text: `Merhaba! Referans Programımımıza katılarak düzenli gelir elde etmek ister misiniz? Bilgi için linke dokunun.`,
      link: this.urlInvite,
      image: "https://recommed.co/app/assets/media/misc/intro.webp"
    }))
  }

  btnWhatsappRecommenderClick(){
    this.urlRecommend = `${environment.appUrl}l/r/${this.appService.currentUserValue?.uid}`;
    window.WebView.postMessage(JSON.stringify({
      type: "whatsappShare",
      text: "Bu işletmeden hizmet aldım ve çok memnun kaldım. İncelemek için linke dokunabilirsin.",
      link: this.urlRecommend,
      image: "https://recommed.co/app/assets/media/misc/intro.webp"
    }))
  }

  btnWhatsappProviderClick(){
    this.urlInvite = `${environment.appUrl}l/i/${this.appService.currentUserValue?.account.invitationCode}/${this.appService.currentUserValue?.uid}`;
    window.WebView.postMessage(JSON.stringify({
      type: "whatsappShare",
      text: "Bu işletmeden hizmet aldım ve çok memnun kaldım. İncelemek için linke dokunabilirsin.",
      link: this.urlInvite,
      image: "https://recommed.co/app/assets/media/misc/intro.webp"
    }))
  }

  btnQRRecommendClick(){
    this.urlRecommend = `${environment.appUrl}l/r/${this.appService.currentUserValue?.uid}`;
    return this.modalQrRecommend.open();
  }

  btnQRInviteClick(){
    this.urlInvite = `${environment.appUrl}l/i/${this.appService.currentUserValue?.account.invitationCode}/${this.appService.currentUserValue?.uid}`;
    return this.modalQrInvite.open();
  }

  updateProps() {
    this.appToolbarPrimaryButton = this.layout.getProp(
      'app.toolbar.primaryButton'
    ) as boolean;
    this.appToolbarPrimaryButtonLabel = this.layout.getProp(
      'app.toolbar.primaryButtonLabel'
    ) as string;
    this.appToolbarPrimaryButtonUrl = this.layout.getProp(
      'app.toolbar.primaryButtonUrl'
    ) as string;
    this.appToolbarPrimaryButtonModal = this.layout.getProp(
      'app.toolbar.primaryButtonModal'
    ) as string;
    this.appToolbarSecondaryButton = this.layout.getProp(
      'app.toolbar.secondaryButton'
    ) as boolean;
    this.secondaryButtonClass = this.appToolbarFixedDesktop
      ? 'btn-light'
      : 'bg-body btn-color-gray-700 btn-active-color-primary';
    this.appToolbarFixedDesktop = this.layout.getProp(
      'appToolbarFixedDesktop'
    ) as boolean;
    this.appToolbarSecondaryButtonLabel = this.layout.getProp(
      'appToolbarSecondaryButtonLabel'
    ) as string;
    this.appToolbarSecondaryButtonUrl = this.layout.getProp(
      'appToolbarSecondaryButtonUrl'
    ) as string;
    this.appToolbarSecondaryButtonModal = this.layout.getProp(
      'appToolbarSecondaryButtonModal'
    ) as string;
    this.appToolbarFilterButton = this.layout.getProp(
      'appToolbarFilterButton'
    ) as boolean;
    this.appToolbarDaterangepickerButton = this.layout.getProp(
      'appToolbarDaterangepickerButton'
    ) as boolean;

    this.filterButtonClass = this.appToolbarFixedDesktop
      ? 'btn-light'
      : 'bg-body btn-color-gray-600 btn-active-color-primary';
    this.daterangepickerButtonClass = this.appToolbarFixedDesktop
      ? 'btn-light'
      : 'bg-body btn-color-gray-700 btn-active-color-primary';
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
