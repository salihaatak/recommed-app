import { Component, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { ApiService, UserType } from 'src/app/modules/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-recommender.component.html',
  styleUrls: ['./dashboard-recommender.component.scss'],
})
export class DashboardRecommenderComponent {
  user: UserType;

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  constructor(
    private apiService: ApiService
  ) {
    this.user = apiService.currentUserValue;

  }

  async openModal() {
    return await this.modalComponent.open();
  }
}
