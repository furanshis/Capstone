import { TestBed } from '@angular/core/testing';

import { AsistenciaserviceService } from './asistenciaservice.service';

describe('AsistenciaserviceService', () => {
  let service: AsistenciaserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsistenciaserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
