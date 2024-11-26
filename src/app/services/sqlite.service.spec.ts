import { TestBed } from '@angular/core/testing';

import { SqliteService } from './SqliteService';

describe('SqliteService', () => {
  let service: SqliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqliteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
