// import { Component, ViewEncapsulation, HostBinding } from '@angular/core';
// import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MydataserviceService } from './mydataservice.service';
import { HttpClient } from '@angular/common/http';
import { routerTransition } from './router.animations';
// import { Router, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/mergeMap';
import { PrintService } from './print.service';

@Component({
  selector: 'app-root',
  animations: [routerTransition],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  // encapsulation: ViewEncapsulation.None
})
// export class AppComponent implements OnInit {
export class AppComponent implements OnInit {
  // @HostBinding('@routerTransition') routerTransition = true; // dinagdag lang
  title = 'op-ciss';

  constructor(public printService: PrintService,
              private http: HttpClient,
              public service: MydataserviceService) { }

  // id = '';
  // state = '';
  // constructor(private router: Router,
  //             private activatedRoute: ActivatedRoute
  // ) {}
  // ngOnInit() {
  //   this.router.events
  //     .filter((event) => event instanceof NavigationStart)
  //     .map(() => this.activatedRoute)
  //     .map((route) => {
  //       while (route.firstChild) { route = route.firstChild; }
  //       this.id = route.snapshot.paramMap.get('id');
  //       return route;
  //     })
  //     .filter((route) => route.outlet === 'primary')
  //     .mergeMap((route) => route.data)
  //     .subscribe((event) => this.state = event['state'] + '-' + this.id );
  // }

  async ngOnInit() {

    // set socket ip
    const surl = await '/api/sip';
    const socket_ip: any = await this.http.get(surl).toPromise();
    const true_socket: any = socket_ip.socket_ip;
    this.service.socket_ip = true_socket;

    // set image_source
    const url = await '/api/pbu';
    const image_source: any = await this.http.get(url).toPromise();
    const true_host: any = image_source.image_source;
    this.service.image_source = true_host;
  }

  getState(outlet) {

    // return this.state;
    // return outlet.activatedRouteData.state + new Date().toLocaleString();

    return outlet.activatedRouteData.state;

    // // outlet.activatedRouteData['state']
    // const animation = outlet.activatedRouteData.state || {};
    // // return animation['value'] || null;
    // return animation || null;
  }
}
