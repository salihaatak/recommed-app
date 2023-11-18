import { Component, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { AppService, UserType } from 'src/app/modules/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-recommender.component.html',
  styleUrls: ['./dashboard-recommender.component.scss'],
})
export class DashboardRecommenderComponent {
  user: UserType;

  modalConfig: ModalConfig = {
    title: 'Modal title'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  constructor(
    private appService: AppService
  ) {
    this.user = appService.currentUserValue;

  }

  async openModal() {
    return await this.modalComponent.open();
  }
}
