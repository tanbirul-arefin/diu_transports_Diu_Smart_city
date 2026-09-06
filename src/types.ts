export type RouteCategory = 'All' | 'City Routes' | 'DIU Shuttle' | 'Friday Schedule';

export interface RouteStop {
  name: string;
  isMainStop?: boolean;
}

export interface BusRoute {
  id: string;
  routeNo: string; // R1, R2, R11, F1 etc.
  name: string;
  category: 'City Routes' | 'DIU Shuttle' | 'Friday Schedule';
  startTimesToDSC: string[];
  departureTimesFromDSC: string[];
  stops: string[];
  routeDetails: string;
  activeBuses: string[];
  totalSeats: number;
  availableSeats: number;
  fare: number; // in BDT (0 for students with semester transport fee)
  status: 'Active' | 'Temporarily Unavailable' | 'Heavy Traffic';
  note?: string;
  frequency?: string;
  startPoint: string;
  destination: string;
}

export interface LiveStop {
  name: string;
  scheduledTime: string;
  actualTime?: string;
  status: 'Departed' | 'Arrived' | 'Upcoming';
}

export interface BusTracking {
  busId: string;
  busNumber: string; // e.g. DIU-07-1203
  routeId: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  currentSpeedKm: number;
  currentStopIndex: number;
  stops: LiveStop[];
  nextStopEtaMinutes: number;
  progressPercentage: number;
  coordinates: { x: number; y: number }[]; // coordinates on the interactive campus route map
  currentCoordIndex: number;
  totalSeats: number;
  occupiedSeats: number;
  status: 'In Progress' | 'Scheduled' | 'Completed';
  lastUpdated: string;
}

export interface Ticket {
  id: string;
  bookingId: string; // e.g. DIUT2405201030
  studentId: string;
  studentName: string;
  studentDepartment: string;
  routeId: string;
  routeName: string;
  busNumber: string;
  seatNumber: number;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  pickupStop: string;
  destinationStop: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  bookingType: 'Upcoming' | 'History' | 'Cancelled';
  qrData: string;
  fare: number;
  paymentMethod: string;
}

export interface TransportNotice {
  id: string;
  title: string;
  category: 'Schedule' | 'Notice' | 'Emergency' | 'Holiday';
  date: string;
  summary: string;
  content: string;
  important: boolean;
}

export interface UserProfile {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: string;
  campus: string;
  phone: string;
  avatarUrl: string;
  semester: string;
  transportFeeStatus: 'Paid' | 'Unpaid';
  preferredRoute: string;
  walletBalance: number;
}
