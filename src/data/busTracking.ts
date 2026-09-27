import { BusRoute, BusTracking } from '../types';

export interface AvailableBus {
  busNumber: string;
  route: BusRoute;
}

export const getAvailableBuses = (routes: BusRoute[]): AvailableBus[] =>
  routes.flatMap((route) =>
    route.status === 'Active'
      ? route.activeBuses.map((busNumber) => ({ busNumber, route }))
      : []
  );

export const buildBusTracking = (
  bus: AvailableBus,
  currentTracking: BusTracking,
  busIndex: number
): BusTracking => {
  const isCurrentBus = bus.busNumber === currentTracking.busNumber;
  const progressPercentage = isCurrentBus
    ? currentTracking.progressPercentage
    : 12 + (Math.max(busIndex, 0) * 17) % 75;
  const currentStopIndex = isCurrentBus
    ? Math.min(currentTracking.currentStopIndex, bus.route.stops.length - 1)
    : Math.min(
        Math.floor((progressPercentage / 100) * bus.route.stops.length),
        bus.route.stops.length - 1
      );
  const currentCoordIndex = isCurrentBus
    ? currentTracking.currentCoordIndex
    : Math.round((progressPercentage / 100) * (currentTracking.coordinates.length - 1));

  return {
    ...currentTracking,
    busId: `bus_${bus.busNumber.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
    busNumber: bus.busNumber,
    routeId: bus.route.id,
    routeName: bus.route.name,
    driverName: isCurrentBus ? currentTracking.driverName : 'Driver details unavailable',
    driverPhone: isCurrentBus ? currentTracking.driverPhone : 'Not provided',
    currentSpeedKm: isCurrentBus
      ? currentTracking.currentSpeedKm
      : 25 + (Math.max(busIndex, 0) * 7) % 16,
    currentStopIndex,
    stops: isCurrentBus
      ? currentTracking.stops
      : bus.route.stops.slice(0, 4).map((name, stopIndex) => ({
          name,
          scheduledTime: bus.route.startTimesToDSC[0] || 'Time unavailable',
          status: stopIndex < currentStopIndex
            ? 'Departed' as const
            : stopIndex === currentStopIndex
              ? 'Arrived' as const
              : 'Upcoming' as const,
        })),
    nextStopEtaMinutes: isCurrentBus
      ? currentTracking.nextStopEtaMinutes
      : Math.max(2, Math.ceil((100 - progressPercentage) / 10)),
    progressPercentage,
    currentCoordIndex,
    totalSeats: bus.route.totalSeats,
    occupiedSeats: isCurrentBus
      ? currentTracking.occupiedSeats
      : bus.route.totalSeats - bus.route.availableSeats,
    status: isCurrentBus ? currentTracking.status : 'In Progress',
    lastUpdated: isCurrentBus ? currentTracking.lastUpdated : 'Demo simulation',
  };
};