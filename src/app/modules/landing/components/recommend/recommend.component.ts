import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResultModel } from '../../models/api-result.mode';
import { AppService } from 'src/app/modules/auth';

@Component({
  selector: 'app-recommend',
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.scss'],
})
export class RecommendComponent implements OnInit, OnDestroy {
  form1: FormGroup;
  hasError: boolean = false;
  isLoading$: Observable<boolean>;
  recommenderName: string;
  recommenderUid: string | null;

  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isLoading$ = this.appService.isLoading$;
  }

  ngOnInit(): void {
    this.recommenderUid = this.route.snapshot.paramMap.get('recommenderUid');
    if (this.recommenderUid){
      const subscr = this.appService
      .post("user/get-recommender", {uid: this.recommenderUid}, false)
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.recommenderName = result.data.name;
        } else {
          this.hasError = true;
        }
      });
      this.unsubscribe.push(subscr);
    }
    this.initForm();
  }

  initForm() {
    this.form1 = this.fb.group(
      {
        name: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        phoneNumber: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
          ]),
        ],
        agree: [true, Validators.compose([Validators.required])],
      }
    );
  }

  submit() {
    this.hasError = false;
    const s = this.appService
      .post(
        "user/recommend-via-landing",
        {
          recommenderUid: this.recommenderUid,
          name: this.form1.controls["name"].value,
          phoneNumber: this.form1.controls["phoneNumber"].value,
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.router.navigate(['l/r/thanks']);
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(s);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
