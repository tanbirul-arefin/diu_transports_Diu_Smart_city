import { useEffect, useState } from 'react';
import { Ticket } from '../types';

const monthNumbers: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const parseClock = (value: string) => {
  const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;

  const hour = Number(match[1]) % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0);
  return { hour, minute: Number(match[2]) };
};

const getDepartureTime = (ticket: Ticket) => {
  const clock = parseClock(ticket.departureTime);
  if (!clock) return null;

  const isoDate = ticket.departureDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const displayDate = ticket.departureDate.match(/^(\d{1,2})\s+([A-Za-z]+),?\s+(\d{4})$/);
  let year: number;
  let month: number;
  let day: number;

  if (isoDate) {
    year = Number(isoDate[1]);
    month = Number(isoDate[2]) - 1;
    day = Number(isoDate[3]);
  } else if (displayDate) {
    year = Number(displayDate[3]);
    month = monthNumbers[displayDate[2].slice(0, 3).toLowerCase()];
    day = Number(displayDate[1]);
    if (month === undefined) return null;
  } else {
    return null;
  }

  const departure = new Date(year, month, day, clock.hour, clock.minute);
  if (departure.getFullYear() !== year || departure.getMonth() !== month || departure.getDate() !== day) {
    return null;
  }
  return departure;
};

const getArrivalTime = (ticket: Ticket) => {
  const departure = getDepartureTime(ticket);
  if (!departure) return null;

  const arrivalClock = parseClock(ticket.arrivalTime);
  if (arrivalClock) {
    const arrival = new Date(departure);
    arrival.setHours(arrivalClock.hour, arrivalClock.minute, 0, 0);
    if (arrival < departure) arrival.setDate(arrival.getDate() + 1);
    return arrival;
  }

  const estimatedMinutes = ticket.arrivalTime.match(/(\d+)\s*min/i);
  departure.setMinutes(departure.getMinutes() + Number(estimatedMinutes?.[1] ?? 60));
  return departure;
};

export const useCurrentPasses = (tickets: Ticket[]) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return tickets.filter((ticket) => {
    if (ticket.status !== 'Confirmed' || ticket.bookingType !== 'Upcoming') return false;
    const arrival = getArrivalTime(ticket);
    return arrival === null || arrival > now;
  });
};