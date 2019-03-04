import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
    `.angular-logo {
        margin: 0 4px 3px 0;
        height: 35px;
        vertical-align: middle;
    }
    .fill-remaining-space {
      flex: 1 1 auto;
    }
    .demo-toolbar {
      display: flex;
      align-items: center;
      width: 100%;
      /* color: #212121; */
    }
    mat-toolbar-row {
      justify-content: space-between;
    }
    .content-center {
      text-align: -webkit-center;
    }
    /* CSS GRID  */
    /* iphone */
    #content{
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      /* grid-gap: 10px; */
      max-width: 100%;  /* 960px; */
      /* margin: 0 auto; */
    }
    /* ipad */
    @media screen and (min-width: 760px) {
      #content{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        /* grid-gap: 10px; */
        max-width: 100%; /* 960px; */
        /* margin: 0 auto; */
      }
    }
    /* macbook 1366+ or 1280+ */
    @media screen and (min-width: 1360px) {
      #content{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        /* grid-gap: 10px; */
        max-width: 100%; /* 960px; */
        /* margin: 0 auto; */
      }
    }
    #content div {
      /* background: #3bbced; */
      /* padding: 10px; */
      /* font-family: Lato; */
      /* background-color: #FCE4EC; */
      /* #E0F7FA */
      /* margin: 2em auto; */
    }
    #content div:nth-child(even){
      /* background: #777; */
      /* padding: 10px; */
      /* font-family: Lato; */
    }
    `
  ]
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;                  // {1}

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn; // {2}
  }

  onLogout() {
    this.authService.logout();                      // {3}
  }

}
