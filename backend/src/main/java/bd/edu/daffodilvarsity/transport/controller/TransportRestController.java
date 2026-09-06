package bd.edu.daffodilvarsity.transport.controller;

import bd.edu.daffodilvarsity.transport.model.BusRoute;
import bd.edu.daffodilvarsity.transport.model.LiveBus;
import bd.edu.daffodilvarsity.transport.model.Ticket;
import bd.edu.daffodilvarsity.transport.service.TransportService;
import bd.edu.daffodilvarsity.transport.dto.BookingRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/transport")
public class TransportRestController {
    private final TransportService transportService;

    public TransportRestController(TransportService transportService) {
        this.transportService = transportService;
    }

    @GetMapping("/routes")
    public List<BusRoute> routes(@RequestParam(required = false) String category) {
        return transportService.getRoutes(category);
    }

    @GetMapping("/routes/{routeNo}")
    public BusRoute route(@PathVariable String routeNo) {
        return transportService.getRoute(routeNo);
    }

    @GetMapping("/tracking/live")
    public List<LiveBus> liveBuses() {
        return transportService.getLiveBuses();
    }

    @PostMapping("/tickets/book")
    public ResponseEntity<Ticket> book(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(transportService.bookSeat(request));
    }

    @GetMapping("/tickets/student/{studentId}")
    public List<Ticket> tickets(@PathVariable String studentId) {
        return transportService.getTickets(studentId);
    }

    @PostMapping("/tickets/verify-qr")
    public ResponseEntity<String> verifyQr(@RequestParam String qrPayload) {
        return ResponseEntity.ok(transportService.verifyQr(qrPayload) ? "PASS_VERIFIED_SUCCESS" : "PASS_INVALID");
    }
}