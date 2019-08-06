import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { MydataserviceService } from '../mydataservice.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;                    // {1}
  private formSubmitAttempt: boolean; // {2}

  constructor(
    private fb: FormBuilder,         // {3}
    private authService: AuthService, // {4}
    private router: Router,           // { NILAGAY NA DITO }
    private http: HttpClient,
    public service: MydataserviceService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({     // {5}
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string) { // {6}
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  async onSubmit() {
    if (this.form.valid) {
      await this.authService.login(this.form.value) // {7}
      .subscribe( async _ => {
        if ( _.success ) {
          try {
            await this.authService.loggedIn.next(true);
            await this.authService.storeUserData(_.token, _.user);
            // set image_source here
            const url = await '/api/pbu';
            const image_source: any = await this.http.get(url).toPromise();
            const true_host: any = image_source.image_source;
            this.service.image_source = true_host;
            await this.authService.log(`authenticated user w/ name=${_.user.userName}`);
            await this.router.navigate(['/']);
          } catch (error) {
            console.log ('Something went wrong. ' + error);
          }
        } else {
          console.log ('Invalid username or password.');
        }
      });
    }
    this.formSubmitAttempt = true;             // {8}
  }

}
