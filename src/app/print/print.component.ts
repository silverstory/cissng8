import { Component, OnInit, OnDestroy } from '@angular/core';
import { PrintService } from '../print.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit, OnDestroy {

  private api = '/api';
  navigationSubscription;
  phrase;
  array: Array<string>;

  constructor(public printService: PrintService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location) {
    // subscribe to the router events - storing the subscription so
    // we can unsubscribe later.
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.getToken();
      }
    });
  }

  async getToken() {
    const phrase = this.route.snapshot.paramMap.get('token');
    this.array = phrase.split('-');
  }

  onPrintInvoice() {
    // const invoiceIds = ['101', '102'];
    this.printService
      .printDocument('invoice', this.array);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return error;
    };
  }

}
