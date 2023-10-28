import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
// #fake-end#

function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      //@ts-ignore
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
          passThruUnknownUrl: true,
          dataEncapsulation: false,
        })
      : [],
    // #fake-end#
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService]
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private route: ActivatedRoute
  ) {
      const urlParameters = new URLSearchParams(window.location.search);
      if (urlParameters.get("firebase_token")){
        localStorage.setItem("firebase_token", urlParameters.get("firebase_token") || "");
      }
      if (urlParameters.get("device_id")){
        localStorage.setItem("device_id", urlParameters.get("device_id") || "");
      }


  }
}
