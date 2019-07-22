import { Component, OnInit , OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../print.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { Profile } from '../profile';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit, OnDestroy {
  invoiceIds: string[];
  invoiceDetails: Promise<any>[];
  private api = '/api';

  constructor(route: ActivatedRoute,
              private printService: PrintService,
              private http: HttpClient,
              private location: Location) {
    this.invoiceIds = route.snapshot.params['invoiceIds']
      .split(',');
  }

  ngOnInit() {
    this.invoiceDetails = this.invoiceIds
      .map(id => this.getInvoiceDetails(id));
    Promise.all(this.invoiceDetails)
      .then(() => this.printService.onDataReady());
  }

  async getInvoiceDetails(invoiceId) {
    // const amount = Math.floor((Math.random() * 100));
    // return new Promise(resolve =>
    //   setTimeout(() => resolve({amount}), 1000)
    // );

    const url = await `${this.api}/profile/token/${invoiceId}`;
    const tmpProfile = await this.http.get<Profile>(url).toPromise();
    // name
    const gender = tmpProfile.gender === 'male' ? 'Mr.' : 'Ms.';
    const name = await `${gender} ${tmpProfile.name.first} ${tmpProfile.name.middle.charAt(0)}. ${tmpProfile.name.last}`;
    // profileid
    const id_num = await `${tmpProfile.profileid}`;
    // location
    let location1;
    let location2;
    if (tmpProfile.distinction.includes('OPVISITOR')) {
      location1 = tmpProfile.visitor.visitorpurpose;
      location2 = tmpProfile.visitor.visitordestination;
    } else {
      location1 = tmpProfile.distinction === 'OPEMPLOYEE' ? tmpProfile.employee.position : tmpProfile.resident.barangay;
      location2 = tmpProfile.distinction === 'OPEMPLOYEE' ? tmpProfile.employee.office : tmpProfile.resident.district;
    }
    // qr code
    const qr = await `${tmpProfile.cissinqtext}`;

    return { id_num, name, location1, location2, qr };

    // return new Promise(resolve =>
    //   setTimeout(() => resolve({id_num}), 1000)
    // );
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
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
