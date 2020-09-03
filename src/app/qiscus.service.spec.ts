import { TestBed } from '@angular/core/testing';

import { QiscusService } from './qiscus.service';

describe('QiscusService', () => {
  let service: QiscusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QiscusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
