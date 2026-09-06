package bd.edu.daffodilvarsity.transport.model;

public record LiveBus(String busNumber, String routeNo, String routeName, String driverName,
                      String driverPhone, int currentSpeedKm, int nextStopEtaMinutes, String status) {}