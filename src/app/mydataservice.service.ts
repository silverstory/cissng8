import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders  } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

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

  private find = 'Approved';
  private limit = 4;

  constructor(private http: HttpClient) { }

  // getMyPhotos(page: number) {
  //   return this.http.get('https://jsonplaceholder.typicode.com/photos?_page=' + page);
  // }

  getProfiles(page: number) {
    const query = `http://localhost:3000/api/profile/accessapprovals?findtext=${this.find}&page=${page}&limit=${this.limit}`;
    console.log(query);
    return this.http.get(query);
  }
}


