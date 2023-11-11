import { Component, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';

@Component({
  selector: 'app-provider',
  templateUrl: './dashboard-provider.component.html',
  styleUrls: ['./dashboard-provider.component.scss'],
})
export class DashboardProviderComponent {
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  constructor() {}

  async openModal() {
    return await this.modalComponent.open();
  }
}
