package bd.edu.daffodilvarsity.transport.service;

import bd.edu.daffodilvarsity.transport.model.BusRoute;
import bd.edu.daffodilvarsity.transport.model.LiveBus;
import bd.edu.daffodilvarsity.transport.model.Ticket;
import bd.edu.daffodilvarsity.transport.repository.BusRouteRepository;
import bd.edu.daffodilvarsity.transport.repository.TicketRepository;
import bd.edu.daffodilvarsity.transport.dto.BookingRequest;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TransportService {
    private final BusRouteRepository routeRepository;
    private final TicketRepository ticketRepository;

    public TransportService(BusRouteRepository routeRepository, TicketRepository ticketRepository) {
        this.routeRepository = routeRepository;
        this.ticketRepository = ticketRepository;
    }

    public List<BusRoute> getRoutes(String category) {
        if (category == null || category.isBlank() || category.equalsIgnoreCase("All")) {
            return routeRepository.findAll();
        }
        return routeRepository.findByCategoryIgnoreCase(category);
    }

    public BusRoute getRoute(String routeNo) {
        return routeRepository.findByRouteNoIgnoreCase(routeNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Route not found: " + routeNo));
    }

    public List<LiveBus> getLiveBuses() {
        return routeRepository.findAll().stream()
                .filter(route -> !route.getActiveBuses().isEmpty())
                .flatMap(route -> route.getActiveBuses().stream().map(bus -> new LiveBus(
                        bus, route.getRouteNo(), route.getName(), "Mohammad Rafiqul Islam",
                        "+880 1819-897654", 34, 8, "In Progress")))
                .toList();
    }

    public Ticket bookSeat(BookingRequest request) {
        BusRoute route = getRoute(request.routeNo());
        if (!"Active".equalsIgnoreCase(route.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This route is not currently available");
        }
        if (request.seatNumber() < 1 || request.seatNumber() > route.getTotalSeats()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seat number is outside this bus");
        }
        LocalDate departureDate = request.departureDate() == null ? LocalDate.now() : request.departureDate();
        if (ticketRepository.existsByRouteNoAndDepartureDateAndSeatNumber(route.getRouteNo(), departureDate, request.seatNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That seat is already booked");
        }

        String bookingId = "DIUT" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        String bus = route.getActiveBuses().isEmpty() ? "DIU-07-1203" : route.getActiveBuses().get(0);
        String pickupStop = request.pickupStop() == null || request.pickupStop().isBlank()
                ? route.getStops().get(0) : request.pickupStop();
        Ticket ticket = new Ticket(bookingId, request.studentId(), request.studentName(), route.getRouteNo(),
                route.getName(), bus, request.seatNumber(), departureDate,
                request.departureTime(), pickupStop, route.getDestination(), "Confirmed",
                "DIU-TRANS-TKT:" + bookingId + "|" + request.studentId() + "|BUS:" + bus + "|SEAT:" + request.seatNumber());
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getTickets(String studentId) {
        return ticketRepository.findByStudentIdOrderByDepartureDateDesc(studentId);
    }

    public boolean verifyQr(String qrPayload) {
        return qrPayload != null && ticketRepository.existsByQrData(qrPayload);
    }

}