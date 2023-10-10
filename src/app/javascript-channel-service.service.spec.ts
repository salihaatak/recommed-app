import { TestBed } from '@angular/core/testing';

import { JavascriptChannelServiceService } from './javascript-channel-service.service';

describe('JavascriptChannelServiceService', () => {
  let service: JavascriptChannelServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JavascriptChannelServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
