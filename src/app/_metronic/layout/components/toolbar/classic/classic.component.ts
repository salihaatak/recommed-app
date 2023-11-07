import { ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../core/layout.service';
import { ModalConfig, ModalComponent } from '../../../../../_metronic/partials';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';


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

  modalConfig: ModalConfig = {
    modalTitle: 'Nasıl paylaşmak istersiniz?',
    hideDismissButton: () => true,
    hideCloseButton: () => true,
  };

  @ViewChild('modal') private modalComponent: ModalComponent;
  constructor(
      private layout: LayoutService,
      private zone: NgZone,
      private cdr: ChangeDetectorRef,
      public appService: AppService
      ) {}

  ngOnInit(): void {
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
        this.appService.post("user/recommend", val).subscribe((result: ApiResultModel | undefined) => {
          this.appService.eventEmitter.emit({type: 'recommendation'});
          this.modalComponent.close();
        })
        this.cdr.detectChanges();
      },
      component: this
    }
  }

  async openModal() {
    return await this.modalComponent.open();
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

  btnShareClick(){
    window.WebView.postMessage(JSON.stringify({
      type: "nativeShare",
      text: "Bu işletmeden hizmet aldım ve çok memnun kaldım. İncelemek için linke dokunabilirsin.",
      link: "https://recommed.co/login.php",
      image: "https://recommed.co/media/putbell/lock.png"
    }))
  }

  btnWhatsappShare(){
    window.WebView.postMessage(JSON.stringify({
      type: "whatsappShare",
      text: "Bu işletmeden hizmet aldım ve çok memnun kaldım. İncelemek için linke dokunabilirsin.",
      link: "https://recommed.co/login.php",
      image: "https://recommed.co/media/putbell/lock.png"
    }))
  }

  btnQRClick(){

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
