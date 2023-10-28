import { Component, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-account.component.html',
  styleUrls: ['./dashboard-account.component.scss'],
})
export class DashboardComponent {
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
