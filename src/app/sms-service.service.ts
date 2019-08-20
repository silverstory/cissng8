import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SmsServiceService {

  constructor(private httpClient: HttpClient) { }

  async sendSMS(mobile: String, message: String) {
    const base_url = 'http://localhost/api/sms/send?';
    mobile = mobile.replace('+63', '0');
    const toMobile = `mobile=${mobile}`;
    const textMessage = `&message=${message}`;
    const url = `${base_url}${toMobile}${textMessage}`;
    const data: any = await
    this.httpClient.get(url,
      httpOptions).toPromise();
   return data;
  }

  // send via 23.52
  // async sendSMS(mobile: String, message: String) {
  //   const base_url = 'http://192.168.23.52/api/sms?';
  //   const token = 'token=ciss-sms-token-here';
  //   mobile = mobile.replace('+63', '0');
  //   const toMobile = `&number=${mobile}`;
  //   const textMessage = `&message=${message}`;
  //   const url = `${base_url}${token}${toMobile}${textMessage}`;
  //   const data: any = await
  //   this.httpClient.get(url,
  //     httpOptions).toPromise();
  //  return data;
  // }
}
