package bd.edu.daffodilvarsity.transport.repository;

import bd.edu.daffodilvarsity.transport.model.BusRoute;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusRouteRepository extends JpaRepository<BusRoute, Long> {
    Optional<BusRoute> findByRouteNoIgnoreCase(String routeNo);
    List<BusRoute> findByCategoryIgnoreCase(String category);
}