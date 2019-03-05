import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders  } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Profile, ProfileObj } from './profile';
import { Approvaltemplate } from './approvaltemplate';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json',
// tslint:disable-next-line:max-line-length
//       'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZTdjYThlOTAxYWQzZTM5Y2Y4Y2RjZiIsImlhdCI6MTUzNjI4NjI5MywiZXhwIjoxNTM2ODkxMDkzfQ.ejgyOhM5BxXnCvJZZyMe_W0rnhyJz1OfteimpWGO04I`
//   })
// };

@Injectable({
  providedIn: 'root'
})
export class MydataserviceService {

  public userapprovaltemplate: Approvaltemplate;
  public find = 'Provisional';
  public distinction = 'OPEMPLOYEE';
  public usertype: string;
  public nextstep = 100;
  public limit = 8; // limit must be atleast 8 and above
  public newestFirst = true;
  private api = '/api';

  constructor(private http: HttpClient) { }

  getProfiles(page: number) {

    // tslint:disable-next-line:max-line-length
    const url = `${this.api}/profile/accessapprovals?findtext=${this.find}&distinction=${this.distinction}&nextstep=${this.nextstep}&page=${page}&limit=${this.limit}&newestfirst=${this.newestFirst}`;
    return this.http.get(url);

  }

  getApprovalTemplate() {
    const approvaltemplateurl = `${this.api}/approvaltemplate}`;
    // tslint:disable-next-line:max-line-length
    const approvaltemplate: any = this.http.post<any>(approvaltemplateurl, { distinction: this.distinction, usertype: this.usertype }, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } });
    if (approvaltemplate !== null) {
      this.userapprovaltemplate = approvaltemplate;
      this.nextstep = approvaltemplate.step;
      return approvaltemplate;
    } else {
      this.nextstep = 100;
      return null;
    }
  }

  // getProfiles(page: number) {

  //   // tslint:disable-next-line:max-line-length
  //   const url = `${this.api}/profile/accessapprovals?findtext=${this.find}&distinction=${this.distinction}&nextstep=${this.nextstep}&page=${page}&limit=${this.limit}&newestfirst=${this.newestFirst}`;
  //   return this.http.get(url);

  // }

  // getApprovalTemplate() {
  //   const approvaltemplateurl = `${this.api}/approvaltemplate}`;
  //   // tslint:disable-next-line:max-line-length
  //   const approvaltemplate: any = this.http.post<any>(approvaltemplateurl, { distinction: this.distinction, usertype: this.usertype }, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } });
  //   if (approvaltemplate !== null) {
  //     this.userapprovaltemplate = approvaltemplate;
  //     this.nextstep = approvaltemplate.step;
  //     return approvaltemplate;
  //   } else {
  //     this.nextstep = 100;
  //     return null;
  //   }
  // }

  saveProfile(profile: Profile) {
    const url = `${this.api}/profile`;
    return this.http.post(url, new ProfileObj(profile));
  }
}
