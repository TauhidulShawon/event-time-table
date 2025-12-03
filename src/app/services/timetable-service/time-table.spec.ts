import { TestBed } from '@angular/core/testing';

import { TimeTable } from './time-table';

describe('TimeTable', () => {
  let service: TimeTable;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeTable);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
