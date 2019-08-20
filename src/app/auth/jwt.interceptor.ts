
import {tap} from 'rxjs/operators';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
export class JwtInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService,
              private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {

        // do stuff with response if you want

        // This is also a great spot to cache any
        // failed requests. This comes in handy if
        // we have token refreshing in place and we
        // want to retry the requests once we have a
        // new token.

      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
        //   With this `collectFailedRequest` in place,
        //   we have the option
        //   of calling retryFailedRequests after the
        //   user’s token is refreshed to fire off the
        //   previously-failed requests. This is just a
        //   small addition that can help to greatly
        //   improve UX, especially if you have tokens
        //   with a very short lifetime.
          this.auth.collectFailedRequest(request);
          // retry failed requests
          // OR
          // redirect to the login route
          this.router.navigate(['/login']);
          // or show a modal
        }
      }
    }));
  }
}