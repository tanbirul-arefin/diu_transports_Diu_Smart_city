package bd.edu.daffodilvarsity.transport.repository;

import bd.edu.daffodilvarsity.transport.model.Ticket;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByStudentIdOrderByDepartureDateDesc(String studentId);
    boolean existsByRouteNoAndDepartureDateAndSeatNumber(String routeNo, java.time.LocalDate departureDate, int seatNumber);
    boolean existsByQrData(String qrData);
}