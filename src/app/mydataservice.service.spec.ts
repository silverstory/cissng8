import { TestBed, inject } from '@angular/core/testing';

import { MydataserviceService } from './mydataservice.service';

describe('MydataserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MydataserviceService]
    });
  });

  it('should be created', inject([MydataserviceService], (service: MydataserviceService) => {
    expect(service).toBeTruthy();
  }));
});
