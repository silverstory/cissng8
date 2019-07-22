import { Injectable } from '@angular/core';
import { Profile } from './profile';

// import { Observable } from 'rxjs/Rx';
import { Observable } from 'rxjs';

import { MessageService } from './message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, catchError, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ProfileService {

  private api = '/api';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  // GET http://localhost:3000/api/profile/270253d17070590077106fba4323188ea733c6aec1f2ed040c47476ef0202365
  /** GET profile by keyword. Will 404 if keyword not found */
  findProfile(phrase: string): Observable<Profile> {
    const url = `${this.api}/profile/${phrase}`;
    return this.http.get<Profile>(url).pipe(
      tap( ( profile: Profile ) => {
        // no code needed here. just emiting values to subscriber.
        this.log(`fetched profile keyword=${phrase}`);
      }),
      catchError(this.handleError<Profile>(`getProfile keyword=${phrase}`))
    );
  }

  // GET http://localhost:3000/api/profile/get/5adfe17eda216211f42bd88f
  /** GET profile by id. Will 404 if id not found */
  getProfile(id: string): Observable<Profile> {
    const url = `${this.api}/profile/get/${id}`;
    return this.http.get<Profile>(url).pipe(
      tap( ( profile: Profile ) => {
        // no code needed here. just emiting values to subscriber.
        this.log(`fetched profile id=${id}`);
      }),
      catchError(this.handleError<Profile>(`getProfile id=${id}`))
    );
  }

  // GET http://localhost:3000/api/profile/get/99997777
  /** GET profile by cisstoken. Will 404 if id not found */
  getProfileByToken(token: string): Observable<Profile> {
    const url = `${this.api}/profile/token/${token}`;
    return this.http.get<Profile>(url).pipe(
      tap( ( profile: Profile ) => {
        // no code needed here. just emiting values to subscriber.
        this.log(`fetched profile token=${token}`);
      }),
      catchError(this.handleError<Profile>(`getProfile id=${token}`))
    );
  }

  /** Log a ProfileService message with the MessageService */
  public log(message: string) {
    this.messageService.add('ProfileService: ' + message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return error;
    };
  }

}
