import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
// import { User } from './../auth/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  form: FormGroup;                    // {1}
  private formSubmitAttempt: boolean; // {2}

  // username ? : String;
  // password ? : String;

  constructor(
    private fb: FormBuilder,          // {3}
    private authService: AuthService, // {4}
    private router: Router            // { NILAGAY NA DITO }
  ) { }

  ngOnInit() {
    this.form = this.fb.group({     // {5}
      userName: ['', Validators.required],
      password: ['', Validators.required],
      usertype: ['', Validators.required],
      mobileno: ['', Validators.required]
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
