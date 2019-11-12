import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
// import { User } from './../auth/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  userType$: Observable<string>;

  form: FormGroup;                    // {1}
  private formSubmitAttempt: boolean; // {2}

  // username ? : String;
  // password ? : String;

  constructor(
    private fb: FormBuilder,          // {3}
    private authService: AuthService, // {4}
    private router: Router,           // { NILAGAY NA DITO }
    private ref: ChangeDetectorRef,
    private zone: NgZone,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({     // {5}
      userName: ['', Validators.required],
      password: ['', Validators.required],
      usertype: ['', Validators.required],
      mobileno: ['', Validators.required],
      useroffice: ['', Validators.required]
    });

    this.userType$ = this.authService.userType; // {2}
    setInterval(() => {
      this.ref.detectChanges();
      this.ref.markForCheck();
      this.zone.run(() => {
        // Here add the code to force the value update
        this.userType$ = this.authService.userType; // This value will be force updated
      });
    }, 3000);
  }

  isFieldInvalid(field: string) { // {6}
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  async onSubmit() {
    if (this.form.valid) {
      this.authService.registerUser(this.form.value) // {7}
      .subscribe( async _ => {
        if (_.success) {
          await this.authService.log(`Your are registered and can log in.`);
          await this.router.navigate(['/login']);
        } else {
          await this.authService.log(`Something went wrong.`);
        }
      });
    }
    this.formSubmitAttempt = true;             // {8}
  }
}
