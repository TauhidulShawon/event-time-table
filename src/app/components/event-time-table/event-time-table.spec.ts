import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTimeTable } from './event-time-table';

describe('EventTimeTable', () => {
  let component: EventTimeTable;
  let fixture: ComponentFixture<EventTimeTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTimeTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTimeTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
