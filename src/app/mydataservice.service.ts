import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders  } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Profile, ProfileObj } from './profile';
import { Approvaltemplate } from './approvaltemplate';

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
    this.nextstep = 100;
    const body = {
      distinction: this.distinction,
      usertype: this.usertype
    };
    const approvaltemplateurl = `${this.api}/approvaltemplate`;
    const approvaltemplate: any = this.http.post<any>(approvaltemplateurl, body);
    if (approvaltemplate !== null) {
      return approvaltemplate;
    }
  }

  saveProfile(profile: Profile) {
    const url = `${this.api}/profile`;
    return this.http.post(url, new ProfileObj(profile));
  }
}
