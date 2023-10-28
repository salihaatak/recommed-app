import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ApplicationRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

declare global {
  interface Window { WebView: any; }
  interface Window { selectContactsCallbackTS: any; }
  interface Window { getLocationCallbackTS: any; }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  public contacts: string;
  public location: string;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/';

    window.selectContactsCallbackTS = {
      zone: this.zone,
      componentFn: (val: any) => {
        this.contacts = JSON.stringify(val);

        this.cdr.detectChanges();
      },
      component: this
    }

    window.getLocationCallbackTS = {
      zone: this.zone,
      componentFn: (val: any) => {
        this.location = JSON.stringify(val);

        this.cdr.detectChanges();
      },
      component: this
    }
  }

  initForm() {
    this.loginForm = this.fb.group({
      contact: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(320),
        ]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    this.hasError = false;
    const loginSubscr = this.authService
      .login(this.loginForm.controls.contact.value, this.loginForm.controls.password.value)
      .pipe(first())
      .subscribe((user: UserModel | undefined) => {
        if (user) {
          this.authService.getUserByToken().subscribe(()=>{
            this.router.navigate(['dashboard']);
          })
        } else {
          this.hasError = true;
        }

      });
    this.unsubscribe.push(loginSubscr);
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

  btnNativeShareClick(){
    window.WebView.postMessage(JSON.stringify({
        type: "nativeShare",
        text: "Bu sağlık kuruluşundan hizmet aldım ve çok memnun kaldım. İncelemek için linke dokunabilirsin.",
        link: "https://recommed.co/login.php",
        image: "https://recommed.co/media/putbell/lock.png"
    }));
  }

  btnGetLocationClick(){
    window.WebView.postMessage(JSON.stringify({
      type: "getLocation"
    }));
  }

  btnWhatsappShareClick(){
    window.WebView.postMessage(JSON.stringify({
        type: "whatsappShare",
        text: "Bu sağlık kuruluşundan hizmet aldım ve çok memnun kaldım. İncelemek için linke dokunabilirsin.",
        link: "https://recommed.co/login.php",
        image: "https://recommed.co/media/putbell/lock.png"
    }));
  }

  btnLikeClick(){
    window.WebView.postMessage(JSON.stringify({
      type: "like"
    }))
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  getFirebaseToken(){
    return localStorage.getItem("firebase_token")
  }

  reloadPage(){
    window.location.reload()
  }
}
