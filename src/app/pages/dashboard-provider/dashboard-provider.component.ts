import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/modules/auth';

@Component({
  selector: 'app-provider',
  templateUrl: './dashboard-provider.component.html',
  styleUrls: ['./dashboard-provider.component.scss'],
})
export class DashboardProviderComponent implements OnInit {
  constructor(private appService: AppService) {
  }

  ngOnInit(): void {

  }



}
