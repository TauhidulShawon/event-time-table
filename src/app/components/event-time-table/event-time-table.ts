import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HotObservable } from 'rxjs/internal/testing/HotObservable';

interface Event {
  id: string;
  title: string;
  venueId: string;
  startTime: string;
  endTime: string;
  date: string;
  duration: number;
}

interface Venue {
  id: string;
  name: string;
  color: string;
}

interface TimeSlot {
  time: string;
  displayTime: string;
}

@Component({
  selector: 'app-event-time-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-time-table.html',
  styleUrl: './event-time-table.scss'
})

export class EventTimeTable {
  currentWeekStart: Date = new Date();
  weekDays: Date[] = [];
  venues: Venue[] = [];
  events: Event[] = [];
  timeSlots: TimeSlot[] = [];
  selectedTabIndex: number = 0;

  readonly minPerSlots = 15;
  readonly slotHeight = 60;
  readonly startHour = 9;
  readonly endHour = 11;

  ngOnInit() {
    localStorage.clear();
    this.initializeWeek();
    this.generateTimeSlots();
    this.loadVenues();
    this.loadEvents();
  }

  initializeWeek() {
    const today = new Date(new Date(this.currentWeekStart));
    console.log(today)
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    this.currentWeekStart = monday;
    this.weekDays = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      this.weekDays.push(day);
    }
    console.log(this.weekDays);
  }

  // ===================== TIME SLOTS GENERATE ===============

  generateTimeSlots() {

    this.timeSlots = [];
    const startMinutes = this.startHour * 60;
    const endMinutes = this.endHour * 60;

    for (let minutes = startMinutes; minutes < endMinutes; minutes += this.minPerSlots) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      console.log(timeStr);
      this.timeSlots.push({
        time: timeStr,
        displayTime: mins === 0 ? `${hours}:${mins.toString().padStart(2, '0')}` : ''
      });
    }
  }


  // =============== LOAD & SAVE VENUS ===============

  loadVenues() {

    this.venues = [
      { id: 'venue1', name: 'Venue 1', color: 'gray' },
      { id: 'venue2', name: 'Venue 2', color: 'gray' },
      { id: 'venue3', name: 'Venue 3', color: 'gray' },
      { id: 'venue4', name: 'Venue 4', color: 'gray' },
      { id: 'venue5', name: 'Venue 5', color: 'gray' },
      { id: 'venue6', name: 'Venue 6', color: 'gray' }
    ];

    this.saveVenues();

  }

  
  // =============== LOAD & SAVE EVENTS ======

  loadEvents() {

    this.events = [
      {
        id: '1',
        title: 'Event 1',
        venueId: 'venue1',
        startTime: '09:00',
        endTime: '09:30',
        date: this.formatDate(this.weekDays[0]),
        duration: 30
      },

      {
        id: '6',
        title: 'Event 2',
        venueId: 'venue1',
        startTime: '10:00',
        endTime: '10:30',
        date: this.formatDate(this.weekDays[0]),
        duration: 30
      },

      {
        id: '7',
        title: 'Event 2',
        venueId: 'venue2',
        startTime: '10:00',
        endTime: '10:30',
        date: this.formatDate(this.weekDays[0]),
        duration: 30
      },

      {
        id: '11',
        title: 'Event 3',
        venueId: 'venue3',
        startTime: '09:45',
        endTime: '10:45',
        date: this.formatDate(this.weekDays[0]),
        duration: 60
      },

      {
        id: '2',
        title: 'Event 3',
        venueId: 'venue2',
        startTime: '09:30',
        endTime: '10:00',
        date: this.formatDate(this.weekDays[1]),
        duration: 30
      },

      {
        id: '3',
        title: 'Event 4',
        venueId: 'venue2',
        startTime: '10:00',
        endTime: '10:30',
        date: this.formatDate(this.weekDays[2]),
        duration: 30
      },
      {
        id: '4',
        title: 'Event 5',
        venueId: 'venue3',
        startTime: '09:45',
        endTime: '11:00',
        date: this.formatDate(this.weekDays[4]),
        duration: 75
      }

    ];
    this.saveEvents();

  }

  saveVenues() {
    localStorage.setItem('venues', JSON.stringify(this.venues));
  }

  saveEvents() {
    localStorage.setItem('events', JSON.stringify(this.events));
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  // ============ HANDLE PREVIOUS & Next Week =================

  previousWeek() {
    const newStart = new Date(this.currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    this.currentWeekStart = newStart;
    console.log("=== CURRENT WEEK ==== " + this.currentWeekStart)
    this.initializeWeek();

  }

  nextWeek() {
    const newStart = new Date(this.currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    this.currentWeekStart = newStart;
    this.initializeWeek();
  }

  selectTab(index: number) {
    this.selectedTabIndex = index;
  }

  getEventsForDateAndVenue(date: Date, venueId: string): Event[] {
    const dateStr = this.formatDate(date);
    return this.events.filter(e => e.date === dateStr && e.venueId === venueId);
  }

  getEventPosition(event: Event): { top: number; height: number } {
    const [hours, minutes] = event.startTime.split(':').map(Number);
    const totalMinutes = (hours * 60 + minutes) - (this.startHour * 60);
    const top = (totalMinutes / this.minPerSlots) * this.slotHeight;
    const height = (event.duration / this.minPerSlots) * this.slotHeight;

    return { top, height };
  }

  onHorizontalScroll(event: any) {
    const scrollLeft = event.target.scrollLeft;
  }
}
