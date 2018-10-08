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
  async sendSMS(number: String, message: String) {
    const base_url = 'http://210.213.193.148:3000/api/sms?';
    const token = 'token=ciss-sms-token-here';
    number = number.replace('+63', '0');
    const toNumber = `&number=${number}`;
    const textMessage = `&message=${message}`;
    const url = `${base_url}${token}${toNumber}${textMessage}`;
    const data: any = await
    this.httpClient.get(url,
      httpOptions).toPromise();
   return data;
  }
}
